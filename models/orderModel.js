const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
      
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      
    },
    products: [
        {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Products",
            required:true
        },
        quantity:{
            type :Number,
            default:1, 
        },
        size:{
            type:String,
        },
        price:{
            type:Number,

        },
        status:{
            type:String,
            enum:["Pending","Shipped","Delivered","Cancelled","Out of the Delivery"],
            default:"Pending"
        },
        total:Number
    }
],
    PaymentMethod:{
        type:String,
        enum:["razorpay","Paypal","COD"]
    },
    status:{
        type:String,
        enum:["Pending","Shipped","Delivered","Cancelled","Out of the Delivery"],
        default:"Pending"
    },
    grandTotal:Number,
    cancelRequest:{
        type:Boolean,
        default:false,
    },
   


},{
    timestamps:true
});


module.exports = mongoose.model("Order",orderSchema);