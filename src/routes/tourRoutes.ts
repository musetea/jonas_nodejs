import { Router } from "express";
import { getAllTours, createTour } from "../controllers/tourController";
import { deleteTour, getTour } from "../controllers/tourController";
import { protect, restrictTo } from "../controllers/authController";

const router = Router();

router.route("/").get(protect, getAllTours).post(protect, createTour);

//
router
	.route("/:id")
	.get(getTour)
	.delete(protect, restrictTo("admin", "lead-guid"), deleteTour);

export default router;
