import {Router} from "express"
import { addStaffToDepartmentValidator, assignHeadToDepartmentValidator, createDepartmentValidator, manageJoinRequestValidator, requestToJoinDepartmentValidator, updateDepartmentValidator } from "../validators/app/department.validators.js";
import { validate } from "../validators/validate.js";
import { addStaffToDepartment, assignHeadToDepartment, createDepartment, deleteDepartmentById, getAllDepartment, getDepartmentById, manageJoinRequest, requestToJoinDepartment, updateDepartmentById } from "../controllers/department.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middlewares.js";
import { userRolesEnum } from "../constant";

const router=Router()

router.route("/create").post(verifyJWT,verifyPermission([userRolesEnum.ADMIN]),createDepartmentValidator(),validate,createDepartment)
router.route("/add-staff/:departmentId").put(verifyJWT,verifyPermission([userRolesEnum.ADMIN]),addStaffToDepartmentValidator(),validate,addStaffToDepartment)
router.route("/assign-head/:departmentId").put(verifyJWT,verifyPermission([userRolesEnum.ADMIN]),assignHeadToDepartmentValidator(),validate,assignHeadToDepartment)
router.route("/request-to-join").post(requestToJoinDepartmentValidator(),validate,requestToJoinDepartment)
router.route("/manage-join-request").put(verifyJWT,manageJoinRequestValidator(),validate,manageJoinRequest)
router.route("/").get(getAllDepartment)
router.route("/:departmentId").get(getDepartmentById)
router.route("/:departmentId").put(verifyJWT,verifyPermission([userRolesEnum.ADMIN]),updateDepartmentValidator(),validate,updateDepartmentById)
router.route("/:departmentId").delete(verifyJWT,verifyPermission([userRolesEnum.ADMIN]),deleteDepartmentById)

export default router;