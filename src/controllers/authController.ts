import { NextFunction, Request, Response } from "express";
import HttpError from "../utils/HttpError";
import User, { IUser, IUserModel } from "../models/user";
import catchAsync from "../utils/catchAsync";
import { sign, verify } from "jsonwebtoken";
import { promisify } from "util";
import { IRequest } from "../types/express";
import sendEmail from "../utils/email";
import { SendMailOptions } from "nodemailer";
import crypto from "crypto";
import { SaveOptions } from "mongoose";

const JWT_SECRET =
	process.env.JWT_SECRET || "my-ultra-secure-and-ultra-long-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";
const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || 30;

const CookieOptions = {
	expires: new Date(Date.now() + +JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
	secure: false, // HTTPS
	httpOnly: true,
};

const signToken = (id: string) => {
	return sign(
		{
			id: id,
		},
		JWT_SECRET,
		{
			expiresIn: JWT_EXPIRES_IN,
		}
	);
};

/**
 * JWT 토큰 전송
 * 로그인, 회원가입, 등등.
 * @param id
 * @param statusCode
 * @param res
 */
const createSendToken = (id: string, statusCode: number, res: Response) => {
	const token = signToken(id);

	// 쿠키전송
	if (process.env.NODE_ENV === "production") CookieOptions.secure = true;
	res.cookie("jwt", token, CookieOptions);

	res.status(statusCode).json({
		status: "success",
		token,
	});
};

const saveOptions: SaveOptions = {
	validateBeforeSave: false, // validate disable
};

/**
 * 접근제한(Role)
 * @param roles
 * @returns
 */
export const restrictTo = (...roles: string[]) => {
	return async (req: IRequest, res: Response, next: NextFunction) => {
		// roles => admin,lead-guide,
		if (!roles.includes(req.user!.role)) {
			return next(new HttpError("not have Permission", 403));
		}
		next();
	};
};

/**
 * 1) Get User based on POSTed email
 * 2) Generatte the random reset token
 * 3) Sending it to user's email
 */
export const forgotPassword = async (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	// 1)
	const email = req.body.email;
	console.log(email);
	const user = await User.findOne({ email: email });
	if (!user) {
		return next(new HttpError("There is no user with email address!!", 404));
	}
	console.log(user);

	// 2 초기화 토근 발행
	const resetToken = user.createPasswordResetToken();
	console.log(resetToken);
	console.log(user);

	const options: SaveOptions = {
		validateBeforeSave: false, // validate disable
	};
	user.save(options).then(err => {
		if (err) {
			console.log(err);
		}
		console.log("user save");
	});

	//3
	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/users/resetPassword/${resetToken}`;
	console.log(resetUrl);

	const messge = `Forgot your password? Submit a PATCH requrest with your new password and 
            paaswordConfirm to : ${resetUrl}. \n If you didn't forget your passoword, please ignore this 
            email!
        `;

	const sendMailOption: SendMailOptions = {
		from: email,
		subject: "Youre Password Reset token (valid for 10 min",
		text: messge,
	};

	try {
		// const result = await sendEmail(sendMailOption);
		// console.log(result);

		res.status(200).json({
			status: "success",
			messge: "Token send to email",
		});
	} catch (err) {
		console.log(err);
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		user.save(options).then(err => {
			if (err) {
				console.log(err);
			}
			console.log("user save");
		});

		return next(new HttpError("send email error try again at later", 500));
	}
};

/**
 * Get User based on the token
 *
 */
export const resetPassword = async (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	const password = req.body.password;
	const passwordConfirm = req.body.passwordConfirm;

	const token = req.params.token;
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

	// 2) get user from token
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: {
			$gt: Date.now(),
		},
	});

	// 사용자가 없으면
	if (!user) {
		return next(new HttpError("Token is invalid or has expired", 400));
	}

	// 데이터베이스 저장
	user.password = password;
	user.passwordConfirm = passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save({ validateBeforeSave: false });

	createSendToken(user._id.toString(), 200, res);
};

/**
 * 보안상 필요한 데이터만
 */
export const signup = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		// const newUser = await User.create(req.body); case 1
		const newUser = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm,
			passwordChangedAt: req.body.passwordChangeAt,
			role: req.body.role,
		});

		// jwt
		createSendToken(newUser._id.toString(), 201, res);
	}
);

/**
 * 로그인
 */
export const signin = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		// 1) 체크
		if (!email || !password) {
			next(new HttpError("이메일과 비밀번호를 확인하세요!!", 400));
			return;
		}

		// 데이터베이스 체크
		const user = await User.findOne({ email: email }).select("+password");
		console.log(user);
		if (!user) {
			next(new HttpError("사용자를 찾을수 없습니다. 확인해주세요!!", 404));
			return;
		}
		// 비밀번호 체크
		const userPassword = user!.password;
		const isCorrect = await user.correctPassword(password, userPassword);
		console.log(isCorrect);
		if (!isCorrect) {
			next(new HttpError("Incorrect email or password!!", 401));
			return;
		}

		createSendToken(user._id.toString(), 200, res);
	}
);

/**
 * 	1) 토큰 체크
    2) 토큰 유효성 체크 
    3) 사용자 체크 
 */
const Bearer = "Bearer";
const tokenVerify = (token: string) => {
	return new Promise((resolve, reject) => {
		try {
			const decode = verify(token, JWT_SECRET);
			resolve(decode);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * 로그인 서비스
 */
export const protect = catchAsync(
	async (req: IRequest, res: Response, next: NextFunction) => {
		//console.log(req);
		let token;
		// 1
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith(Bearer)
		) {
			// console.log(req.headers.authorization);
			token = req.headers.authorization.split(" ")[1];
		}
		if (!token) {
			return next(new HttpError("Your are not loggined in!", 401));
		}
		console.log(token);

		//2, 만료토큰체크
		const decode = (await tokenVerify(token)) as { id: string; iat: Date };
		console.log(decode);

		//3. 토큰을...
		const user = await User.findById(decode.id);
		console.log(user);
		if (!user) {
			next(new HttpError("토큰 사용자가 존재하지 않습니다", 403));
		}

		// 비밀번호 변경전의 토큰일경우
		const isCheck = user!.changedPasswordAfter(decode.iat);
		console.log(isCheck);
		if (isCheck) {
			return next(new HttpError("User Recentd passwrod!! ", 401));
		}

		req.user = {
			email: user!.email || "",
			id: user!._id.toString() || "",
			role: user!.role || "",
		};

		console.log(req.user);
		next();
	}
);

/**
 * 1) Get User from Collection
 * 2) check if POST current passwor is
 * 3) update password
 * 4) Log user in send JWT
 * @param req
 * @param res
 * @param next
 */
export const updatePassword = async (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	console.dir(req);
	const currentPassword = req.body.passwordCurrent;
	const newPassword = req.body.password;
	const newPasswordConfirm = req.body.passwordConfirm;
	if (!newPassword || !newPasswordConfirm || !currentPassword) {
		return next(new HttpError("Invalid data", 400));
	}
	console.log(newPassword, newPasswordConfirm, currentPassword);
	//1) get user
	const email = req.user!.email;
	const user = await User.findOne({ email: email }).select("+password");
	console.log(user);
	if (!user) {
		return next(new HttpError("로그인을 해주세요", 401));
	}

	//2) 현재암호와 데이터베이스 암호 체크
	const isCheck = await user.correctPassword(currentPassword, user.password);
	if (!isCheck) {
		return next(new HttpError("현재 비빌번호가 틀립니다.", 401));
	}

	//3) findByIdAndUpdate() 함수는 현재 모델에서 사용할경우 pre('save') 미들웨어가 동작안됨.
	user.password = newPassword;
	user.passwordConfirm = newPasswordConfirm;
	user.save(saveOptions).then(err => {
		if (err) console.log(err);
		console.log("user saved");
	});

	// 4)
	createSendToken(user._id.toString(), 200, res);
};
