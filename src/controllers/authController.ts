import { NextFunction, Request, Response } from "express";
import HttpError from "../utils/HttpError";
import User, { IUser, IUserModel } from "../models/user";
import catchAsync from "../utils/catchAsync";
import { sign, verify } from "jsonwebtoken";
import { promisify } from "util";
import { IRequest } from "../types/express";

const JWT_SECRET =
	process.env.JWT_SECRET || "my-ultra-secure-and-ultra-long-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

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

export const restrictTo = (...roles: string[]) => {
	return async (req: IRequest, res: Response, next: NextFunction) => {
		// roles => admin,lead-guide,
		if (!roles.includes(req!.user!.role)) {
			return next(new HttpError("not have Permission", 403));
		}
		next();
	};
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
		const token = signToken(newUser._id.toString());

		res.status(201).json({
			status: "success",
			token,
			data: {
				user: newUser,
			},
		});
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
		const id = user._id.toString();

		//  토큰 생성
		let token = signToken(id);

		//
		res.status(200).json({
			status: "success",
			token,
		});
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
		const isCheck = user?.changedPasswordAfter(decode.iat);
		console.log(isCheck);
		if (isCheck) {
			return next(new HttpError("User Recentd passwrod!! ", 401));
		}

		req.user = {
			email: user?.email,
			id: user?._id.toString(),
			role: user?.role,
		};

		console.log(req.user);
		next();
	}
);
