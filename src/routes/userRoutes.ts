import { Router } from "express";
import { signup, signin } from "../controllers/authController";
import { getAllUser, createUser } from "../controllers/userController";
import { getUser, updateUser, deleteUser } from "../controllers/userController";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
//
router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
