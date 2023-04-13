import { Router } from "express";
import { signup, signin, forgotPassword, resetPassword } from "../controllers/authController";
import { getAllUser, createUser } from "../controllers/userController";
import { getUser, updateUser, deleteUser } from "../controllers/userController";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);
//
//
router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
