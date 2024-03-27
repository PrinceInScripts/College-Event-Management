import mongoose,{ Schema } from "mongoose" 
import { AvailableUserGenderEnum, AvailableUserRoles, USER_TEMPORARY_TOKEN_EXPIRY, userRolesEnum } from "../constant.js";

const studentSchema=new Schema({
       username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
       },
       email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
       },
       password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:AvailableUserRoles,
        default:userRolesEnum.STUDENT,
        required:true,
    },
    fullname:{
        type:String
    },
    birthday:{
        type:Date
    },
    gender:{
        type:string,
        enum:AvailableUserGenderEnum,
        default:""
    },
    address:{
        type:String
    },
    phone:{
        type:String
    },
    avatar:{
        type:String
    },
    department:{
        type:Schema.Types.ObjectId,
        ref:"Department"
    },
    eventAttended:{
        type:Schema.Types.ObjectId,
        ref:"Event"
    },
    eventOrganized:{
        type:Schema.Types.ObjectId,
        ref:"Event"
    },
    isEmailVerified:{
        type:Boolean,
        default:false,
    },
    refreshToken:{
        type:String,
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpiry: {
        type: Date,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationExpiry: {
        type: Date,
    },
},{timestamps:true})

studentSchema.pre("save",async function(next){
    if(!this.modified("password")) return next();

    this.password=await bcrypt.hash(this.password,10)
    next();
})


studentSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

studentSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.email,
            role:this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

studentSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

studentSchema.methods.generateTemporaryToken=function(){
    const unHashedToken=crypto.randomBytes(20).toString("hex")

    const hashedToken=crypto 
                            .createHash("sha26")
                            .update(unHashedToken)
                            .digest("hex")

    const tokenExpiry=Date.now() + USER_TEMPORARY_TOKEN_EXPIRY

    return {unHashedToken,hashedToken,tokenExpiry}
}

export const Student=mongoose.model("Student",studentSchema);

