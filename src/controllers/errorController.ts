import { NextFunction, Request, Response } from "express";
import HttpError from "../utils/HttpError";
const isDev = process.env.NODE_ENV === "developement";
const isProd = process.env.NODE_ENV === "production";

// 몽구디비에러
const handleCastDBError = (err: any) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new HttpError(message, 400);
};
const handleDuplicationFeildsError = (err: any) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value ${value}. Please use another value!`;
	return new HttpError(message, 400);
};
const handleValidationDbError = (err: any) => {
	const errors = Object.values(
		err.errors.map((el: { message: string }) => el.message)
	);
	const message = `Invalid Input Data ${errors.join(". ")}`;
	return new HttpError(message, 400);
};
const handleJWTError = (error: any) => {
	const msg = `Invalid token, Please log in again`;
	return new HttpError(msg, 401);
};
const handleJWTExpireError = (error: any) => {
	const msg = `Token Expire, Please log in again`;
	return new HttpError(msg, 401);
};

const sendDevError = (err: HttpError, res: Response) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

/**
 * 프로덕션 에러처리
 * @param err
 * @param res
 */
const sendProdError = (err: any, res: Response) => {
	if (err.isOperational) {
		// 현재 정의된 에러
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		// 프로그래밍에러 & 알수없는 에러
		// 1) 콘솔출력
		console.error("ERROR ", err);
		// 2)
		res.status(500).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}
};

export const errorController = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// console.log(isDev, isProd);
	// console.log(process.env);
	//console.log(err.stack);
	err.statusCode = err.statusCode || 500;

	if (isDev) {
		return sendDevError(err, res);
	} else if (isProd) {
		let error = { ...err };
		if (error.name === "CastError") error = handleCastDBError(error);
		if (error.code === 11000) error = handleDuplicationFeildsError(error);
		if (error.name === "ValidationError")
			error = handleValidationDbError(error);
		if (error.name === "JsonWebTokenError") error = handleJWTError(error);
		if (error.name === "TokenExpiredError") error = handleJWTExpireError(error);

		sendProdError(error, res);
	} else {
		res.status(500).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}
};
export default errorController;
