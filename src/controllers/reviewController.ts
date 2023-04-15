import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import HttpError from "../utils/HttpError";
import { IRequest } from "../types/express";
//
import Review from "../models/review";

const returnError = (res: Response) => {
	res.status(500).json({
		status: "error",
		message: "아직 구현되지 않았습니다.",
	});
};

export const getAllReviews = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const reviews = await Review.find();
		res.status(200).json({
			status: "success",
			data: {
				reviews,
			},
		});
	}
);

export const createReview = catchAsync(
	async (req: IRequest, res: Response, next: NextFunction) => {
		const { review, rating, tour } = req.body;
		const userId = req.user!.id;

		const inReview = {
			review: review,
			rating: rating,
			user: userId,
			tour: tour,
		};

		const newReview = await Review.create(inReview);
		console.log(newReview);

		res.status(201).json({
			status: "success",
			data: {
				review: newReview,
			},
		});
	}
);
