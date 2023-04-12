import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Tour from "../models/tour";
import HttpError from "../utils/HttpError";

/**
 * getAllTours
 */
export const getAllTours = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {}
);

/**
 * createTour
 */
export const createTour = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const newTour = {};

		res.status(201).json({
			status: "success",
			data: {
				tour: newTour,
			},
		});
	}
);

export const getTour = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const tour = {};

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
