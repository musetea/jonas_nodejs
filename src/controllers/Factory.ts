import { NextFunction, Request, Response } from "express";
import { Model, QueryOptions, PopulateOptions } from "mongoose";
import catchAsync from "../utils/catchAsync";
import HttpError from "../utils/HttpError";

const returnError = (res: Response) => {
	res.status(500).json({
		status: "error",
		message: "아직 구현되지 않았습니다.",
	});
};

export const deleteOne = <T>(model: Model<T>) =>
	catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		console.log(id);
		if (!id) {
			return next(new HttpError("Invalid Parameter", 400));
		}

		const tour = model.findByIdAndDelete(id);
		if (!tour) {
			console.log(tour);
			return next(new HttpError(`No tour found with tat id (${id})`, 400));
		}
		res.status(204).json({
			status: "success",
			data: null,
		});
	});

export const updateOne = <T>(model: Model<T>) =>
	catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		if (!id) {
			return next(new HttpError("", 400));
		}

		const options: QueryOptions = {
			new: true,
			runValidators: true,
		};
		const vales = { ...req.body };

		const doc = await model.findByIdAndUpdate(id, vales, options);

		res.status(200).json({
			status: "success",
			data: {
				value: doc,
			},
		});
	});

export const getOne = <T>(model: Model<T>, options?: PopulateOptions) =>
	catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		if (!id) {
			return next(new HttpError("", 400));
		}
		let query = model.findById(id);
		//if (options) query = query.populate(options);
		const doc = await query;

		if (!doc) {
			return next(new HttpError(`No document found with that id(${id})`, 404));
		}

		res.status(200).json({
			status: "success",
			data: {
				value: doc,
			},
		});
	});
