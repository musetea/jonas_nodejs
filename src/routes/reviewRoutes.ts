import { Router } from "express";
import { protect, restrictTo } from "../controllers/authController";
import { getAllReviews, createReview } from "../controllers/reviewController";

const router = Router();

router
	.route("/")
	.get(getAllReviews)
	.post(protect, restrictTo("user"), createReview);

export default router;
