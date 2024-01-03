const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    items: [
        {
            products: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products", 
                
            },
            quantity: {
                type: Number,
                default: 1
            },
            size:{
                type :String,
                default:"M"
                },
            price:{
                type:String,
            
            }
            
        }
    ] 
});

module.exports = mongoose.model("carts", cartSchema);
