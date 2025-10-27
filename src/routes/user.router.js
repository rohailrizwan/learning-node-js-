import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../Controllers/user.controller.js";
import verifyJwt from "../middleware/user.middleware.js";

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt , logoutUser)

export default router