import mongoose,{ Schema } from "mongoose" 
import { AvailableUserGenderEnum, AvailableUserRoles, userRolesEnum } from "../constant";

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




export const Student=mongoose.model("Student",studentSchema);

