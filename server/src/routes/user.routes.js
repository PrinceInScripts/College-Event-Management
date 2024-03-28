import { Router } from "express";
import { assignRole, changeCurrentPassword, forgotPassword, getAllStaff, getAllStudents, getCurrentUser, loginInUser, logoutUser, registerUser, resendEmailVerification, resetForgotPassword, updateProfile, updateUserAvatar, verifyEmail } from "../controllers/user.controller.js";
import { updateProfileValidator, userAssignRoleValidator, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgottenPasswordValidator } from "../validators/app/user.validators.js";
import { validate } from "../validators/validate.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middlewares.js";
import { userRolesEnum } from "../constant.js";
import { mongoIdPathVariableValidator } from "../validators/mongodb.validators.js";
import { upload } from "../middlewares/multer.middlewares.js";


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
router.route("/avatar").post(verifyJWT,upload.single('avatar'),updateUserAvatar)
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/update-profile").post(verifyJWT,updateProfileValidator(),validate,updateProfile)

router.route("/all-staff").get(verifyJWT,getAllStaff)
router.route("/all-students").get(verifyJWT,getAllStudents)

export default router;
