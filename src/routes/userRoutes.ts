import { Router } from "express";
import {
	signup,
	signin,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
} from "../controllers/authController";
import {
	getAllUser,
	createUser,
	updateMe,
} from "../controllers/userController";
import { getUser, updateUser, deleteUser } from "../controllers/userController";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

//
router.patch("/updatePassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);
//
//
router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
