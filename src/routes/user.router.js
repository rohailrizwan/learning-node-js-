import { Router } from "express";
import { changePassword, loginUser, logoutUser, registerUser, sendOtp } from "../Controllers/user.controller.js";
import verifyJwt from "../middleware/user.middleware.js";

const router=Router()

router.route("/register").post(registerUser)
router.route("/change-password").post(verifyJwt,changePassword)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt , logoutUser)

// otp

router.route("/send-otp").post(sendOtp)

export default router