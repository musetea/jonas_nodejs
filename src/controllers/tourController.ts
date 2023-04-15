import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Tour from "../models/tour";
import HttpError from "../utils/HttpError";
// 컨트롤러
import { protect, restrictTo } from "./authController";
import { createReview } from "../controllers/reviewController";

/**
 * getAllTours
 */
export const getAllTours = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		res.status(200).json({
			status: "success",
			data: [],
		});
	}
);

/**
 * createTour
 */
export const createTour = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const newTour = { ...req.body };
		console.log("newTour", newTour);
		const result = await Tour.create(newTour);

		res.status(201).json({
			status: "success",
			data: {
				tour: result,
			},
		});
	}
);

export const getTour = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params.id;
		if (!id) {
			return next(new HttpError("Invalid Tour Id", 400));
		}
		//const tour = await Tour.findById(id).populate("guides");
		const tour = await Tour.findById(id).populate("guides").populate("review");

		if (!tour) {
			next(new HttpError("Not tour found with that ID", 404));
			return;
		}

		res.status(200).json({
			status: "success",
			data: {
				tour: tour,
			},
		});
	}
);

export const updateTour = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const tour = {};
		res.status(200).json({
			status: "success",
			data: {
				tour: tour,
			},
		});
	}
);

export const deleteTour = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const tour = {};
		res.status(204).json({
			status: "success",
			data: null,
		});
	}
);

export const getTourStats = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const state = "";
	}
);

export const getMonthlyPlan = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const state = "";
	}
);
