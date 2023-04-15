import { Router } from "express";
import { protect, restrictTo } from "../controllers/authController";
import {
	getAllReviews,
	createReview,
	deleteReview,
	updateReview,
	getReview,
} from "../controllers/reviewController";

/*
	계층적 구조의 라우터를 사용할 때, 
	라우터의 선언 시 Router({ mergeParams: true }) 를 사용해야, 
	이전 라우터에서 전달된 path parameter를 사용할 수 있다
*/
const router = Router({
	mergeParams: true,
});

router
	.route("/")
	.get(getAllReviews)
	.post(protect, restrictTo("user"), createReview);

router
	.route("/:id")
	.get(protect, getReview)
	.delete(protect, deleteReview)
	.patch(protect, updateReview);

export default router;
