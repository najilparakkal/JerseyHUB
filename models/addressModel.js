const mongoose = require("mongoose");

const addressModel = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    fullName:{
        type:String,
        required:true
    },
    phoneNum:{
        type:Number, 
        required:true
    },
    district:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true 
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        requierd:true
    },
    houseNum:{
        type:Number,
        required:true
    }
})

    module.exports=mongoose.model("Address",addressModel);