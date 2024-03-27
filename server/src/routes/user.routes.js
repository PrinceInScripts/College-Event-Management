import { Router } from "express";
import { loginInUser, registerUser, verifyEmail } from "../controllers/user.controller.js";
import { userLoginValidator, userRegisterValidator } from "../validators/app/user.validators.js";
import { validate } from "../validators/validate.js";


const router=Router()

router.route("/register").post(userRegisterValidator(),validate,registerUser)
router.route("/login").post(userLoginValidator(),validate,loginInUser)
router.route("/verify-email/:verificationToken").get(verifyEmail);

export default router;
