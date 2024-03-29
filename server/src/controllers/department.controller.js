
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

    const {name,description,staff,address,phone,email}=req.body;

    const department=await Department.create({
        name,
        description,
        staff
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


const updateDepartmentById=asyncHandler(async (req,res)=>{
    const {name,description,address,phone,email}=req.body;
    const {departmentId}=req.params

    const department=await Department.findById(departmentId)

    if(!department){
        throw new ApiError(404,"Department not found")
    }
    
    if(req.user.role !=="ADMIN"){
        throw new ApiError(403,"Unauthorized access")
    }

    department.name = name || department.name;
    department.description = description || department.description;
    department.contactInfo.address=address || department.contactInfo.address;
    department.contactInfo.phone=phone || department.contactInfo.phone;
    department.contactInfo.email=email || department.contactInfo.email;

    await department.save({validateBeforeSave:false})

    return res
             .status(201)
             .json(
                new ApiResponse(
                    200,
                    department,
                    "Department updated successfully"
                )
             )

})

const deleteDepartmentById=asyncHandler(async (req,res)=>{
    const {departmentId}=req.params;

    const department=await Department.findById(departmentId)

    if(!department){
        throw new ApiError(404,"Department not found")
    }

    if(req.user.role !=="ADMIN"){
        throw new ApiError(403,"Unauthorized access")
    }

    await Department.findByIdAndDelete(department._id);

    return res
             .status(201)
             .json(
                new ApiResponse(
                    201,
                    {},
                    "Department deleted Successfully"
                )
             )

})

const addStaffToDepartment=asyncHandler (async(req,res)=>{
    const {departmentId,staffIds}=req.body

    if(req.user.role !=="ADMIN"){
        throw new ApiError(403,"Unauthorized access")
    }

    const department=await Department.findById(departmentId)

    if(!department){
        throw new ApiError(404,"Department not found")
    }

    const staffToAdd = await User.find({ _id: { $in: staffIds } });

    if (staffToAdd.length !== staffIds.length){
        throw new ApiError(201,"One or more staff members not found")
    }

    department.staff.push(...staffIds)
    await department.save({validateBeforeSave:false})

    return res
             .status(201)
             .json(
                new ApiResponse(
                    201,
                    department,
                    "Staff members added to the department successfully"
                )
             )

})


export {
    createDepartment,
    getAllDepartment,
    getDepartmentById,
    updateDepartmentById,
    deleteDepartmentById,
    addStaffToDepartment
}