
import { userRolesEnum } from "../constant.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { asyncHandler } from "../utils/asyncHandler.utils.js"
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.utils.js"
import crypto from "crypto"


const registerUser=asyncHandler(async (req,res)=>{
    const {username,email,password,role}=req.body

       const existedUser=await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User already exists");
    }

    const user=await User.create({
        email,
        password,
        username,
        isEmailVerified:false,
        role:role || userRolesEnum.STUDENT,
    })

    const { unHashedToken, hashedToken, tokenExpiry }=user.generateTemporaryToken()

    user.emailVerificationToken=hashedToken
    user.emailVerificationExpiry=tokenExpiry
    await user.save({validateBeforeSave:false})
    
    await sendEmail({
        email:user?.email,
        subject:"Please verify your email",
        mailgenContent:emailVerificationMailgenContent(
            user?.username,
            `${req.protocol}://${req.get(
                "host"
              )}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    const createUser=await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
        )

    if(!createUser){
        throw new ApiError(500,"User not created")
    }

    return res
              .status(201)
              .json(
                new ApiResponse(
                    200,
                    {user:createUser},
                    "Users registered successfully and verification email has been sent on your email."
                )
              )
})

const verifyEmail=asyncHandler(async(req,res)=>{
    const {verificationToken}=req.params;

    if(!verificationToken){
        throw new ApiError(400,"Email verification token is missing")
    }

    let hashedToken=crypto
                        .createHash("sha256")
                        .update(verificationToken)
                        .digest("hex")

    const user=await User.findOne({
        emailVerificationToken:hashedToken,
        emailVerificationExpiry:{$gt:Date.now()}
    })

    if(!user){
        throw new ApiError(400,"token is invalid or expired")
    }

    user.emailVerificationToken=undefined
    user.emailVerificationExpiry=undefined

    user.isEmailVerified=true
    await user.save({validateBeforeSave:false})

    return res
             .status(200)
             .json(new ApiResponse(200, {isEmailVerified:true}, "Email verified successfully"));
})


export {
    registerUser,
    verifyEmail
}