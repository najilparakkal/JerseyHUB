const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }, 
    status:{
        type:Boolean,
        default:true
    },
    isListed:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model("Category",categorySchema);