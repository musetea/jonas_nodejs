import mongoose, { model, Schema, Model, ObjectId } from "mongoose";
import User from "./user";
// import validator from "validator";

export interface ITour {
	name: string;
	slug?: string;
	duration: number;
	maxGroupSize: number;
	difficulty: string;
	ratingsAverage?: number;
	ratingsQuantity?: number;
	price: number;
	priceDiscount?: number;
	summary: string;
	description?: string;
	imageCover: string;
	images: string[];
	createdAt?: Date;
	startDates?: Date[];
	secretTour?: boolean;
	startLocation?: any;
	locations?: any[];
	guides?: string[];
	reviews?: any[];
}

interface ITourDocument extends ITour {}
export interface ITourModel extends Model<ITourDocument> {}

const tourSchma = new Schema<ITourDocument>(
	{
		/** */
		name: {
			type: String,
			required: [true, "A tour must have a name"],
			unique: true,
			trim: true,
			maxlength: [40, "A tour name must have less or equal then 40 characters"],
			minlength: [10, "A tour name must have more or equal then 10 characters"],
			// validate: [validator.isAlpha, 'Tour name must only contain characters']
		},
		slug: String,
		duration: {
			type: Number,
			required: [true, "A tour must have a duration"],
		},
		maxGroupSize: {
			type: Number,
			required: [true, "A tour must have a group size"],
		},
		difficulty: {
			type: String,
			required: [true, "A tour must have a difficulty"],
			enum: {
				values: ["easy", "medium", "difficult"],
				message: "Difficulty is either: easy, medium, difficult",
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, "Rating must be above 1.0"],
			max: [5, "Rating must be below 5.0"],
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, "A tour must have a price"],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (val: number): boolean {
					// this only points to current doc on NEW document creation
					// return val < this.price;
					return true;
				},
				message: "Discount price ({VALUE}) should be below regular price",
			},
		},
		summary: {
			type: String,
			trim: true,
			required: [true, "A tour must have a description"],
		},
		description: {
			type: String,
			trim: true,
		},
		imageCover: {
			type: String,
			required: [true, "A tour must have a cover image"],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		startDates: [Date],
		secretTour: {
			type: Boolean,
			default: false,
		},

		startLocation: {
			type: {
				type: String,
				default: "Point",
				enum: ["Point"],
			},
			coordinates: [Number],
			address: String,
			description: String,
		},
		locations: [
			{
				type: {
					type: String,
					default: "Point",
					enum: ["Point"],
				},
				coordinates: [Number],
				address: String,
				description: String,
				day: Number,
			},
		],

		// 참조처리
		guides: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

/**
 * 미들웨어
 */
// tourSchma.pre("save", async function (next) {
// 	const guidesPromise = this.guides?.map(async id => await User.findById(id));
// 	this.guides = await Promise.all(guidesPromise);
// 	next();
// });

/**
 * 여행일수를 주단위로
 */
tourSchma.virtual("durationWeeks").get(function () {
	return this.duration / 7;
});

/**
 * 여행에 대한 모든 리뷰들 만든다.
 * 인터페이스에 reviews 항목을 추가해줘야 동작함.
 */
tourSchma.virtual("reviews", {
	ref: "Review",
	foreignField: "tour",
	localField: "_id",
});

const Tour = model("Tour", tourSchma);

export default Tour;
