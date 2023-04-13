import HttpError from "../utils/HttpError";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import catchAsync from "../utils/catchAsync";

export const getAllUser = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		res.status(200).json({
			status: "success",
			data: {
				users: [],
			},
		});
	}
);

export const createUser = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		res.status(404).json({
			status: "fail",
			message: "구현되지 않았습니다.",
		});
	}
);

export const getUser = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		res.status(404).json({
			status: "fail",
			message: "구현되지 않았습니다.",
		});
	}
);
export const updateUser = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		res.status(404).json({
			status: "fail",
			message: "구현되지 않았습니다.",
		});
	}
);
export const deleteUser = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		res.status(404).json({
			status: "fail",
			message: "구현되지 않았습니다.",
		});
	}
);
