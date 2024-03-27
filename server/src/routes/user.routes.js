import { Router } from "express";
import { Register } from "../controllers/user.controller.js";


const router=Router()

router.route("/").post(Register)

export default router;
