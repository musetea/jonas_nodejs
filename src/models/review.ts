/**
 * Tour & User 없이 리뷰를 작성할수 없다.
 */

import {
	Schema,
	Model,
	SchemaTypes,
	model,
	PopulateOptions,
	SchemaType,
} from "mongoose";
import Tour from "./tour";

interface IReview {
	review: string;
	rating: number;
	createAt: Date;
	tour: {
		type: Schema.Types.ObjectId;
		ref: string;
	};
	user: {
		type: Schema.Types.ObjectId;
		ref: string;
	};
}

interface IReviewDocument extends IReview, Document {}
interface IReviewModel extends Model<IReviewDocument> {
	calcAverageRatings: (tour: any) => any;
}

//const userSchema: Schema<IUserDocument> = new Schema({
const reivewSchema: Schema<IReviewDocument> = new Schema(
	{
		review: {
			type: String,
			required: [true, "작성하실 리뷰를 남겨주세요"],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
		},
		createAt: {
			type: Date,
			default: Date.now,
		},
		tour: {
			type: SchemaTypes.ObjectId,
			ref: "Tour",
			required: [true, "리뷰에는 Tour 정보가 포함되어져야 합니다."],
		},
		user: {
			type: SchemaTypes.ObjectId,
			ref: "User",
			required: [true, "리뷰에는 Userw 정보가 포함되어져야 합니다."],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// 미들웨어

/** Populate (tour, user) */
reivewSchema.pre(/^find/, function (next) {
	const tour: PopulateOptions = {
		path: "tour",
		select: "name",
	};
	const user: PopulateOptions = {
		path: "user",
		select: "name photo",
	};

	this
		//.populate(tour)
		.populate(user);

	next();
});

reivewSchema.post("save", function () {
	console.log("post save", this.tour);
	Review.calcAverageRatings(this.tour);
});

/**
 *
 * @param tourId
 * @returns
 */
reivewSchema.statics.calcAverageRatings = async function (tourId) {
	//console.log("calcAverageRatings", tourId);

	const stats = await this.aggregate([
		{
			$match: {
				tour: tourId,
			},
		},
		{
			$group: {
				_id: "$tour",
				nRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);
	// console.log(stats);
	//return stats;
	await Tour.findByIdAndUpdate(tourId, {
		ratingsAverage: stats[0].avgRating,
		ratingsQuantity: stats[0].nRating,
	});
};

// 3. Create a Model.
const Review = model<IReviewDocument, IReviewModel>("Review", reivewSchema);
export default Review;
