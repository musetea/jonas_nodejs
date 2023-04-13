import { Schema, model, connect, Model } from "mongoose";
import validator from "validator";
import { compare, compareSync, hash } from "bcrypt";
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
	passwordConfirm: string;
	passwordChangedAt?: Date;
}
interface IUserDocument extends IUser, Document {
	correctPassword: (
		candidatePassword: string,
		userPassword: string
	) => Promise<boolean>;

	changedPasswordAfter: (dt: Date) => {};
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
});

// 2-1 미들웨어
// 비밀번호가 수정될경우만
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	// 비밀번호 해싱
	const e: any = this;
	const hashPass = await hash(e.password, 12);
	e.password = hashPass;
	e.passwordConfirm = undefined;
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

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp: number) {
	const e: any = this;
	if (e.passwordChangedAt) {
		console.log(e.passwordChangedAt.toString());
		const changeTimestamp =
			new Date(e.passwordChangedAt.toString()).getTime() / 1000;
		console.log(changeTimestamp);
		console.log(e.passwordChangeAt, jwtTimeStamp, changeTimestamp);
		return jwtTimeStamp < changeTimestamp;
	}
	return false;
};

// 3. Create a Model.
const User = model<IUserDocument, IUserModel>("User", userSchema);

export default User;