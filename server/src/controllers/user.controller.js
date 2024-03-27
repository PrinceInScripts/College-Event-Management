
import { userRolesEnum } from "../constant.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { ApiResponse } from "../utils/ApiResponse.utils.js"
import { asyncHandler } from "../utils/asyncHandler.utils.js"
import { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } from "../utils/mail.utils.js"
import crypto from "crypto"

const generateAccessAndRefreshTokens=async (userId)=>{
    try {
        const user=await User.findById(userId)

        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken;

        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating the access token")
    }
}

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

const loginInUser=asyncHandler(async(req,res)=>{
    const {email,username,password}=req.body


    const user=await User.findOne({
       $or:[{email},{username}]
    })

    if(!user){
       throw new ApiError(401,"Invalid credentials")
    }

   
    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
       throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    const loggedInUser=await User.findById(user._id).select( "-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    const options={
       httpOnly:true,
       secure:true
       // secure: process.env.NODE_ENV === "production",
    }

    return res
              .status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",refreshToken,options)
              .json(
               new ApiResponse(
                   200,
                   {user:loggedInUser,accessToken,refreshToken},
                   "User Logged in Successfully"
               )
              )
})


const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
      $set:{
          refreshToken:undefined,
      }
    },
    {new:true}
    )
  
    const options={
      httpOnly:true,
      secure:true
      // secure: process.env.NODE_ENV === "production",
   }

   return res
              .status(200)
              .clearCookie("accessToken", options)
              .clearCookie("refreshToken", options)
              .json(new ApiResponse(200, {}, "User logged out"));


})

const resendEmailVerification=asyncHandler(async (req,res)=>{
  
    const user=await User.findById(req.user?._id)
   
    if(!user){
        throw new ApiError(400,"User does not exists",[])
    }

    if(user.isEmailVerified){
        throw new ApiError(400,"Email is already verified!",)
    }

    const { unHashedToken, hashedToken, tokenExpiry }=user.generateTemporaryToken()

    user.emailVerificationToken=hashedToken
    user.emailVerificationExpiry=tokenExpiry
    await user.save({validateBeforeSave:false})
 

    await sendEmail({
        email:user?.email,
        subject:"Please verify your email",
        mailgenContent:emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get(
                "host"
              )}/api/v1/users/verify-email/${unHashedToken}`
        )
    })

    return res
            .status(200)
            .json(new ApiResponse(200, {}, "Mail has been sent to your mail ID"));
})


const forgotPassword=asyncHandler(async(req,res)=>{
    const {email,username}=req.body


    const user=await User.findOne({
       $or:[{email},{username}]
    })
 
 
    if(!user){
     throw new ApiError(400,"User does not exists",[])
    }
 
    const {unHashedToken,hashedToken,tokenExpiry}=user.generateTemporaryToken()
 
    user.forgotPasswordToken=hashedToken
    user.forgotPasswordExpiry=tokenExpiry
    await user.save({validateBeforeSave:false})
 
    await sendEmail({ 
      email:user?.email,
      subject:"Reset your password",
      mailgenContent: forgotPasswordMailgenContent(
         user.username,
         `${req.protocol}://${req.get(
         "host"
       )}/api/v1/users/reset-password/${unHashedToken}`
      )
    })
 
    return res
             .status(200)
             .json(new ApiResponse(200, {}, "Password reset mail has been sent on your mail id"));
 })

 const resetForgotPassword=asyncHandler(async(req,res)=>{
    const {resetToken}=req.params
    const {newPassword}=req.body

    let hashedToken=crypto
                        .createHash("sha256")
                        .update(resetToken)
                        .digest("hex")
    
    const user=await User.findOne({
        forgotPasswordToken:hashedToken,
        forgotPasswordExpiry:{$gt:Date.now()}
    })

    if(!user){
        throw new ApiError(400,"token is invalid or expired")
    }

    user.password=newPassword;
    await user.save({validateBeforeSave:false})

    return res
              .status(200)
              .json(new ApiResponse(200, {}, "Password reset successfully"));
})

const changeCurrentPassword =asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body    
    
    const user=await User.findById(req.user?._id)

    const isPasswordValid=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(400,"Invalid old password")
    }

    user.password=newPassword;  
    await user.save({validateBeforeSave:false})

    return res 
              .status(200)
              .json(new ApiResponse(200, {}, "Password changed successfully"));

})



export {
    registerUser,
    verifyEmail,
    loginInUser,
    logoutUser,
    resendEmailVerification,
    forgotPassword,
    resetForgotPassword,
    changeCurrentPassword
}