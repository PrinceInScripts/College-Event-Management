
import { userRolesEnum } from "../constant.js"
import { Department } from "../models/department.models.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { asyncHandler } from "../utils/asyncHandler.utils.js"

const createDepartment=asyncHandler(async (req,res)=>{

    if(req.user?.role !== "ADMIN"){
        throw new ApiError(403,"Unauthorized access")
    }

    const {name,description,address,phone,email}=req.body;

    const department=await Department.create({
        name,
        description
    })

    department.contactInfo.address=address;
    department.contactInfo.phone=phone;
    department.contactInfo.email=email;

    await department.save({validateBeforeSave:false})

    return res
             .status(201)
             .json(
                new ApiResponse(
                     201,
                     department,
                     "Department created SUccessfully"
                )
             )
})


export {
    createDepartment
}