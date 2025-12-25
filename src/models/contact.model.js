import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        required:true
    },
},{
    timestamps:true
})

export const contact = new mongoose.model('contact',contactSchema)
