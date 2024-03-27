import { body, param } from "express-validator";
import { AvailableUserRoles } from "../../constant.js";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at lease 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("role")
      .optional()
      .isIn(AvailableUserRoles)
      .withMessage("Invalid user role"),
  ];
};

const userLoginValidator = () => {
    return [
      body("email").optional().isEmail().withMessage("Email is invalid"),
      body("username").optional(),
      body("password").notEmpty().withMessage("Password is required"),
    ];
  };
  
  const userForgotPasswordValidator = () => {
    return [
        body("email").optional().isEmail().withMessage("Email is invalid"),
        body("username").optional(),
    ];
  };
  
  const userResetForgottenPasswordValidator = () => {
    return [body("newPassword").notEmpty().withMessage("Password is required")];
  };

  const userChangeCurrentPasswordValidator = () => {
    return [
      body("oldPassword").notEmpty().withMessage("Old password is required"),
      body("newPassword").notEmpty().withMessage("New password is required"),
    ];
  };
  
  const userAssignRoleValidator = () => {
    return [
      body("role")
        .optional()
        .isIn(AvailableUserRoles)
        .withMessage("Invalid user role"),
    ];
 };


 const updateProfileValidator = () => {
    return [
        body("fullname")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Fullname is required"),
        body("birthday")
            .optional()
            .isISO8601()
            .toDate()
            .withMessage("Invalid birthday format"),
        body("gender")
            .optional()
            .trim()
            .isIn(["male", "female", "other"])
            .withMessage("Invalid gender"),
        body("address")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Address is required"),
        body("phoneNumber")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Phone number is required")
            .isMobilePhone()
            .withMessage("Invalid phone number format")
    ];
};

export {
    userRegisterValidator,
    userLoginValidator,
    userForgotPasswordValidator,
    userResetForgottenPasswordValidator,
    userChangeCurrentPasswordValidator,
    userAssignRoleValidator,
    updateProfileValidator
}