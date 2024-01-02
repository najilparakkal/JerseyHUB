const mongoose=require("mongoose");

const adminModel=new mongoose.Schema({

  

    email:{
        type:String,
        required:true
     },
     password:{
        type:String,
        requird:true
     }
   
})

module.exports=mongoose.model("Admin",adminModel)