const mongoose = require('mongoose');
const Address = require("./addressModel")

const userModel = new mongoose.Schema({
   userName:{
      type:String,
      required:true
   },
   email:{
      type:String,
      required:true
   },
   password:{ 
      type:String,
      requird:true
   },
   phoneNum:{
      type:Number,
      required:true
   },
   isBlocked:{
      type:Boolean,
      require:true,
      default:false
   },
   address:[Address.schema],
   cart:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Cart"
   },
   wallet: {
      type: Number,
      default: 0,
   },
    history: {
      type: Array,
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
       timestamp: {
         type: Date,
         default: Date.now, // Default value will be the current timestamp
       },
   },
   referalCode:{
      type:String,
      require:true    
   }
},{
   timestamps:true
})
 
module.exports = mongoose.model('User',userModel);
     