const mongoose=require("mongoose");

const productModel=new mongoose.Schema({

    images:[
    {
        type:String
    }
    ],
    coverimage:{
        type:String
    },
    name:{
        type:String
    },
    price:{
        type:Number
    },
    brand:{
        type:String
    },
    stock:{
        type:Number
    },
    category:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
        
    },
    isListed:{
        type:Boolean,
        default:true
    },
    description:{
        type:String
    },
    offerPrice:{
        type:String,
    },


},
{
    timestamps:true
}
);

const Products=mongoose.model("Products",productModel);

module.exports=Products


