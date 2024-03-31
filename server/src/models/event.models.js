import mongoose,{ Schema } from "mongoose";
import { AvailableEventTypeEnum } from "../constant.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const eventSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique: true,
        maxlength: 255,
    },
    image:{
        type:String
    },
    date:{
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > Date.now(); 
            },
            message: 'Event date must be in the future',
        },
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        maxlength: 255,
    },
    departments:[{
     type:Schema.Types.ObjectId,
     ref:"Department"
    }],
    type:{
        type:String,
        enum:AvailableEventTypeEnum,
        required: true,
    },
    organizer:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    participants:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    registrationDeadline:{
        type:Date,
        validate: {
            validator: function(value) {
                return !this.date || value < this.date; 
            },
            message: 'Registration deadline must be before the event date',
        },
    },
    capacity:{
        type:Number,
        min:0
    }
},{timestamps:true})

eventSchema.plugin(mongooseAggregatePaginate)

const Event=mongoose.model("Event",eventSchema)



