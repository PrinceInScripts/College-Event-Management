import { Router } from "express";
import { assignRole, changeCurrentPassword, forgotPassword, loginInUser, logoutUser, registerUser, resendEmailVerification, resetForgotPassword, verifyEmail } from "../controllers/user.controller.js";
import { userAssignRoleValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgottenPasswordValidator } from "../validators/app/user.validators.js";
import { validate } from "../validators/validate.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middlewares.js";
import { userRolesEnum } from "../constant.js";
import { mongoIdPathVariableValidator } from "../validators/mongodb.validators.js";


const router=Router()

router.route("/register").post(userRegisterValidator(),validate,registerUser)
router.route("/login").post(userLoginValidator(),validate,loginInUser)
router.route("/verify-email/:verificationToken").get(verifyEmail);

router.route("/forgot-password").post(userForgotPasswordValidator(),validate,forgotPassword);
router.route("/reset-password/:resetToken").post(userResetForgottenPasswordValidator(),validate,resetForgotPassword);
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/admin/assign-role/:userId").post(verifyJWT,verifyPermission([userRolesEnum.ADMIN]),mongoIdPathVariableValidator("userId"),userAssignRoleValidator(),validate,assignRole)
router.route("/resend-email-verification").post(verifyJWT,resendEmailVerification)


export default router;
