import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import HttpError from "../utils/HttpError";
import { IRequest } from "../types/express";
//
import Review from "../models/review";
import { deleteOne, updateOne, getOne } from "./Factory";

const returnError = (res: Response) => {
	res.status(500).json({
		status: "error",
		message: "아직 구현되지 않았습니다.",
	});
};

export const getAllReviews = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		let filter = {};
		const tour = req.params.tourId;
		if (tour) {
			filter = {
				tour: tour,
			};
		}
		const reviews = await Review.find(filter);
		res.status(200).json({
			status: "success",
			results: reviews.length,
			data: {
				reviews,
			},
		});
	}
);

/**
 * /api/v1/tour/:tourId/reviews
 */
export const createReview = catchAsync(
	async (req: IRequest, res: Response, next: NextFunction) => {
		let tour = req.params.tourId;
		const userId = req.user!.id;
		const { review, rating } = req.body;
		if (req.body.tour) tour = req.body.tour;

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
export const getReview = getOne(Review);
export const deleteReview = deleteOne(Review);
export const updateReview = updateOne(Review);
