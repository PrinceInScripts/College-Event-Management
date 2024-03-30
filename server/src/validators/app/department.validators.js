import {body,param} from "express-validator"

const createDepartmentValidator=()=>{
    return [
        body('name').notEmpty().withMessage('Name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('address').notEmpty().withMessage('Address is required'),
        body('phone').notEmpty().withMessage('Phone is required'),
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format')
    ]
}

const addStaffToDepartmentValidator=()=>{
    return [
        body('departmentId').notEmpty().withMessage('Department ID is required').isMongoId().withMessage('Invalid department ID'),
    body('staffIds').isArray().withMessage('Staff IDs should be an array').notEmpty().withMessage('At least one staff ID is required')
    ]
}

const assignHeadToDepartmentValidator=()=>{
    return [
        body('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid user ID'),
        param('departmentId').notEmpty().withMessage('Department ID is required').isMongoId().withMessage('Invalid department ID')
    ]
}

const requestToJoinDepartmentValidator=()=>{
    return [
            body('departmentId').notEmpty().withMessage('Department ID is required').isMongoId().withMessage('Invalid department ID')
    ]
}

const manageJoinRequestValidator=()=>{
    return [
        body('departmentId').notEmpty().withMessage('Department ID is required').isMongoId().withMessage('Invalid department ID'),
    body('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid user ID'),
    body('action').notEmpty().withMessage('Action is required').isIn(['APPROVE', 'REJECT']).withMessage('Invalid action')
    ]
}

const updateDepartmentValidator=()=>{
    return [
        param('departmentId').notEmpty().withMessage('Department ID is required').isMongoId().withMessage('Invalid department ID'),
        body('name').optional().notEmpty().withMessage('Name is required'),
        body('description').optional().notEmpty().withMessage('Description is required'),
        body('address').optional().notEmpty().withMessage('Address is required'),
        body('phone').optional().notEmpty().withMessage('Phone is required'),
        body('email').optional().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format')
    ]
}

export {
    createDepartmentValidator,
    addStaffToDepartmentValidator,
    assignHeadToDepartmentValidator,
    requestToJoinDepartmentValidator,
    manageJoinRequestValidator,
    updateDepartmentValidator
}