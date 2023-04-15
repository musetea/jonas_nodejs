import { Router } from "express";
import {
	signup,
	signin,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
	restrictTo,
} from "../controllers/authController";
import {
	getAllUser,
	createUser,
	updateMe,
	deleteMe,
} from "../controllers/userController";
import {
	getUser,
	updateUser,
	deleteUser,
	getMe,
} from "../controllers/userController";

const router = Router();
// all access
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// 로그인 사용자만 접근
router.use(protect);
router.patch("/updatePassword", updatePassword);
router.get("/me", getMe, getUser);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);
//
//
router.use(restrictTo("admin"));
router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
