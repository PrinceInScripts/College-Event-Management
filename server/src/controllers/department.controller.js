
import { userRolesEnum } from "../constant.js"
import { Department } from "../models/department.models.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { asyncHandler } from "../utils/asyncHandler.utils.js"
import { getMongoosePaginationOptions } from "../utils/helper.utils.js"

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

const getAllDepartment=asyncHandler(async (req,res)=>{
    const {page=1,limit=10}=req.query;

    const departmentAggregate=Department.aggregate([{$match:{}}])

    const departments=await Department.aggregatePaginate(
        departmentAggregate,
        getMongoosePaginationOptions({
            page,
            limit,
            customLabels:{
                totalDocs:"Departments",
                docs:"department"
            }
        })
    )


    return res
             .status(201)
             .json(
                new ApiResponse(
                    201,
                    departments,
                    "Departments fetched successfully"
                )
             )
})

const getDepartmentById=asyncHandler(async(req,res)=>{
    const {departmentId}=req.params

    const department=await Department.findById(departmentId)

    if(!department){
        throw new ApiError(404,"Department not found")
    }

    return res
             .status(201)
             .json(
                new ApiResponse(
                    201,
                    department,
                    "Department fetched successfully"
                )
             )
})


export {
    createDepartment,
    getAllDepartment,
    getDepartmentById
    
}