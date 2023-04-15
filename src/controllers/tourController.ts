import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Tour from "../models/tour";
import HttpError from "../utils/HttpError";
// 컨트롤러
import { protect, restrictTo } from "./authController";
import { createReview } from "../controllers/reviewController";
import { deleteOne, updateOne } from "./Factory";
import { Model } from "mongoose";

/**
 * getAllTours
 */
export const getAllTours = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const tours = await Tour.find();

		res.status(200).json({
			status: "success",
			data: tours,
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
		const tour = await Tour.findById(id).populate("guides").populate("reviews");

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

export const updateTour = updateOne(Tour);

/**
 * 삭제
 */
// export const deleteTour = catchAsync(
// 	async (req: Request, res: Response, next: NextFunction) => {
// 		const id = req.params.id;
// 		if (!id) {
// 			return next(new HttpError("Invalid Parameter", 400));
// 		}

// 		const tour = Tour.findByIdAndDelete(id);
// 		if (!tour) {
// 			console.log(tour);
// 			return next(new HttpError(`No tour found with tat id (${id})`, 400));
// 		}
// 		res.status(204).json({
// 			status: "success",
// 			data: null,
// 		});
// 	}
// );
export const deleteTour = deleteOne(Tour);

export const getTourStats = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const state = await Tour.aggregate([
			{
				$match: {
					ratingsAverage: {
						$gte: 4.5,
					},
				},
			},
			{
				$group: {
					_id: {
						$toUpper: "$difficulty",
					},
					numTours: {
						$sum: 1,
					},
					numRatings: {
						$sum: "$ratingsQuantity",
					},
					avgRating: {
						$avg: "$ratingsAverage",
					},
					avgPrice: {
						$avg: "$price",
					},
					minPrice: {
						$min: "$price",
					},
					maxPrice: {
						$max: "$price",
					},
				},
			},
			{
				$sort: {
					avgPrice: 1,
				},
			},
		]);

		res.status(200).json({
			status: "success",
			data: {
				value: state,
			},
		});
	}
);

export const getMonthlyPlan = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const state = "";
	}
);
