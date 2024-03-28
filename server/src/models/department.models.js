import mongoose,{ Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const departmentSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    staff:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    head:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    students:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    pendingRequest:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    contactInfo: {
        address: String,
        phone: String,
        email: String
      }
    
},{timestamps:true})

departmentSchema.plugin(mongooseAggregatePaginate)

export const Department=mongoose.model("Department",departmentSchema)