import { Router } from "express";
import { getAllTours } from "../controllers/tourController";
import { deleteTour } from "../controllers/tourController";
import { protect, restrictTo } from "../controllers/authController";

const router = Router();

router.route("/").get(protect, getAllTours);

//
router
	.route("/:id")
	.delete(protect, restrictTo("admin", "lead-guid"), deleteTour);

export default router;
