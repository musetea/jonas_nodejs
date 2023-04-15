import { Router } from "express";
//
import { getAllTours, createTour } from "../controllers/tourController";
import { deleteTour, getTour, updateTour } from "../controllers/tourController";
import { protect, restrictTo } from "../controllers/authController";
import { createReview } from "../controllers/reviewController";
//
import reviewRoutes from "../routes/reviewRoutes";

const router = Router();
/**
 * tour 라우터에서 reivew 라우터 연동
 */
router.use("/:tourId/review", reviewRoutes);
// reivew router

router
	.route("/")
	.get(getAllTours)
	.post(protect, restrictTo("admin", "lead-guid"), createTour);

//
router
	.route("/:id")
	.get(getTour)
	.patch(protect, restrictTo("admin", "lead-guid"), updateTour)
	.delete(protect, restrictTo("admin", "lead-guid"), deleteTour);

// review router
// router
// 	.route("/:tourId/reviews")
// 	.post(protect, restrictTo("user"), createReview);

export default router;
