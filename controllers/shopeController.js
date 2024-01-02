const Product = require("../models/productModels")
const User = require("../models/userModels");
const Cart = require("../models/cart")
const Address = require("../models/addressModel")
const Order = require("../models/orderModel")
const Category = require("../models/categoryModels")





const shope =async(req,res)=>{try{

    const user = req.session.user_id;
    if (user) {
        const category = await Category.find()
        const product = await Product.find({isListed:true})
        res.render("shope",{product,category});
    } else {
        res.redirect('/homepage')
    }}catch(err){
    console.log(err);
    if(err){
        res.render("404page")
    }
}
}



module.exports={
    shope
}