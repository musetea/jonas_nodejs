import HttpError from "../utils/HttpError";
import { NextFunction, Request, Response } from "express";
import { IRequest } from "../types/express";
import User from "../models/user";
import catchAsync from "../utils/catchAsync";

const UpdateOption = {
	new: true,
	runValidators: true,
};

const filterUpdate = (target: any, ...allowFields: string[]) => {
	let filter: any = {};
	Object.keys(target).forEach(key => {
		//console.log(key);
		if (allowFields.includes(key)) {
			//console.log(target[key]);
			filter[key] = target[key];
		}
	});
	//console.log(filter);
	return filter;
};

export const getAllUser = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const users = await User.find();

		res.status(200).json({
			status: "success",
			data: {
				users: users,
			},
		});
	}
);

/**
 * 로그인한 사용자의 정보를 업데이트
 * 비밀번호정보는 업데이트를 하지 않는다.
 */
export const updateMe = catchAsync(
	async (req: IRequest, res: Response, next: NextFunction) => {
		//console.log("updateMe", req.body);
		const { password, passwordConfirm } = req.body;
		if (password || passwordConfirm) {
			next(
				new HttpError(
					"/updateMe 라우터에서는 비밀번호 변경을 할수 없습니다. /updatePassword 라우터를 사용!",
					400
				)
			);
			return;
		}

		// 2) 사용자의 변경 가능 정보만 업데이트
		const updateOption = {
			new: true,
			runValidators: true,
		};
		const id = req.user!.id;
		const updateFilter = filterUpdate(req.body, "name", "email");
		const updateUser = await User.findByIdAndUpdate(
			id,
			updateFilter,
			updateOption
		);
		//console.log("updateUser", updateUser);

		res.status(200).json({
			status: "success",
			data: {
				user: updateUser,
			},
		});
	}
);

/**
 * 삭제방법론
 * 1) active 필드를 비활성화로 처리하므로 삭제처리로 여김
 */
export const deleteMe = catchAsync(
	async (req: IRequest, res: Response, next: NextFunction) => {
		const id = req.user!.id;
		if (!id) {
			return next(new HttpError("Not Login User", 403));
		}
		const updateUser = await User.findByIdAndUpdate(
			id,
			{ active: false },
			UpdateOption
		);
		console.log(updateUser);
		res.status(204).json({
			status: "success",
		});
	}
);

export const getMe = async (
	req: IRequest,
	res: Response,
	next: NextFunction
) => {
	req.params.id = req.user!.id;
	next();
};

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
		const id = req.params.id;
		if (!id) {
			return next(new HttpError("Invalid Parameter", 400));
		}

		const doc = await User.findById(id);
		if (!doc) {
			return next(new HttpError("Not found User", 404));
		}

		res.status(200).json({
			status: "success",
			data: {
				user: doc,
			},
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
