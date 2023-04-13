import { Schema, model, connect, Model } from "mongoose";
import validator from "validator";
import { compare, hash } from "bcrypt";
import crypto from "crypto";
/**
 * name
 * email
 * photo
 * password
 * passwordConfirm
 */
export interface IUser {
	name: string;
	email: string;
	photo?: string;
	password: string;
	role: string;
	passwordConfirm?: string;
	passwordChangedAt?: Date;
	passwordResetToken?: String;
	passwordResetExpires?: Date;
	active: boolean;
}
interface IUserDocument extends IUser, Document {
	correctPassword: (
		candidatePassword: string,
		userPassword: string
	) => Promise<boolean>;

	changedPasswordAfter: (dt: Date) => boolean;
	createPasswordResetToken: () => string;
}
export interface IUserModel extends Model<IUserDocument> {}

// 2)
const userSchema: Schema<IUserDocument> = new Schema({
	name: { type: String, required: [true, "Please tell us your name!"] },
	email: {
		type: String,
		required: [true, "Please provide your email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Please provide a valid email"],
	},
	photo: {
		type: String,
	},
	role: {
		type: String,
		enum: ["user", "guide", "lead-guide", "admin"],
		default: "user",
	},
	password: {
		type: String,
		required: [true, "Please provider a password"],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "Please confirm a password"],
		validate: {
			// Create and SAVE
			validator: function (el: string): boolean {
				const e: any = this;
				//console.log(e);
				//console.log(el);
				return el === e.password;
				//return true;
			},
			message: "Please are not password",
		},
	},
	passwordChangedAt: {
		type: Date,
	},
	passwordResetToken: {
		type: String,
	},
	passwordResetExpires: {
		type: Date,
	},
	active: {
		type: Boolean,
		default: true,
		select: false, // 기본조회시 조회 안됨
	},
});

// 2-1 미들웨어
// 비밀번호가 수정될경우만
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	// 비밀번호 해싱
	//const e: any = this;
	const hashPass = await hash(this.password, 12);
	this.password = hashPass;
	this.passwordConfirm = undefined;
	console.log(this.password, this.passwordConfirm);
	next();
});

/**
 * 비밀번호 변경시 변경일시 저장
 */
userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) {
		return next();
	}
	this.passwordChangedAt = new Date(); // 현재시간
	console.log(this.passwordChangedAt);
	next();
});

/**
 * active !== false
 */
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword: string,
	userPassword: string
) {
	console.log(candidatePassword);
	console.log(userPassword);
	//const e: any = this;
	return await compare(candidatePassword, userPassword);
};

/**
 *
 * @param jwtTimeStamp
 * @returns
 */
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp: number) {
	const e: any = this;
	if (this.passwordChangedAt) {
		//console.log(e.passwordChangedAt.toString());
		const changeTimestamp =
			new Date(this.passwordChangedAt.toString()).getTime() / 1000;
		//console.log(changeTimestamp);
		//console.log(e.passwordChangeAt, jwtTimeStamp, changeTimestamp);
		return jwtTimeStamp < changeTimestamp;
	}
	return false;
};

/**
 * 비밀번호 리셋 토큰 반환
 * @returns
 */
userSchema.methods.createPasswordResetToken = function () {
	//console.log(this);

	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10분

	//console.log(resetToken, e.passwordResetToken, e.passwordResetExpires);
	return resetToken;
};

// 3. Create a Model.
const User = model<IUserDocument, IUserModel>("User", userSchema);

export default User;
