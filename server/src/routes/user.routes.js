import { Router } from "express";
import { changeCurrentPassword, forgotPassword, loginInUser, logoutUser, registerUser, resendEmailVerification, resetForgotPassword, verifyEmail } from "../controllers/user.controller.js";
import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgottenPasswordValidator } from "../validators/app/user.validators.js";
import { validate } from "../validators/validate.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router=Router()

router.route("/register").post(userRegisterValidator(),validate,registerUser)
router.route("/login").post(userLoginValidator(),validate,loginInUser)
router.route("/verify-email/:verificationToken").get(verifyEmail);

router.route("/forgot-password").post(userForgotPasswordValidator(),validate,forgotPassword);
router.route("/reset-password/:resetToken").post(userResetForgottenPasswordValidator(),validate,resetForgotPassword);
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/resend-email-verification").post(verifyJWT,resendEmailVerification)


export default router;
