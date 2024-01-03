const Product = require("../models/productModels")
const User = require("../models/userModels");
const Cart = require("../models/cart")
const Address = require("../models/addressModel")
const bcrypt = require('bcryptjs');
const Order = require("../models/orderModel")
const Razorpay = require("razorpay")


const profile = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 })
        .populate({
                path: 'products.product',
                model: 'Products' 
            }).populate("address")
            
        const user = await User.findById(userId);
        const address = await Address.find({ userId: user._id });

        res.render("profile", { user: user, address: address, orders });
    } catch (err) {
        console.log(err);
        res.render("404page");
    }
};





const address = async(req,res)=>{
    try{
        res.render("address")
    }catch(err){
        console.log(err);
        if(err){
            res.render("404page")
        }
    }
}

const getAddress = async(req,res)=>{
    try{
        userId = req.session.user_id;
        if(userId){
            
            const address = new Address({
                userId:userId,
                fullName:req.body.fullName,
                phoneNum:req.body.phoneNum,
                district:req.body.district,
                pincode:req.body.pincode,
                city:req.body.city,
                state:req.body.state,
                houseNum:req.body.houseNum,

            })
            await address.save()
            res.redirect("/profile")
    
        }
    }catch(err){
        console.log(err);
        if(err){
            res.render("404page")
        }
    }
}

const editAdd = async(req,res)=>{
    try{
        const addressId = req.query.id;
        const addressData = await Address.findById(addressId);
        res.render("editAddress",{address:addressData})
    }catch(err){
        console.log(err);
        if(err){
            res.render("404page")
        }
    }
}
const editAddd = async(req,res)=>{
    try{
        const addressId = req.query.id;
        const addressData = await Address.findById(addressId);
        res.render("addressEdit",{address:addressData})
    }catch(err){
        console.log(err);
        if(err){
            res.render("404page")
        }
    }
}
const updateAdd = async(req,res)=>{
    try{

        const address = await Address.findByIdAndUpdate(req.body.id,
            {
                $set:{
                    fullName:req.body.fullName,
                    phoneNum:req.body.phoneNum,
                    district:req.body.district,
                    pincode:req.body.pincode,
                    city:req.body.city,
                    state:req.body.state,
                    houseNum:req.body.houseNum,
                }
            })
            if(address){
                res.redirect("/checkOut");
            }else{
                res.send("Somthing has happend Check the Console")
            }

    }catch(err){
        console.log(err);
        if(err){
            res.render("404page");
        }
    }
}

const updateAddd = async(req,res)=>{
    try{

        const address = await Address.findByIdAndUpdate(req.body.id,
            {
                $set:{
                    fullName:req.body.fullName,
                    phoneNum:req.body.phoneNum,
                    district:req.body.district,
                    pincode:req.body.pincode,
                    city:req.body.city,
                    state:req.body.state,
                    houseNum:req.body.houseNum,
                }
            })
            if(address){
                res.redirect("/checkOut");
            }else{
                res.send("Somthing has happend Check the Console")
            }

    }catch(err){
        console.log(err);
        if(err){
            res.render("404page");
        }
    }
}

const updateProfileAdd = async(req,res)=>{
    try{

        const address = await Address.findByIdAndUpdate(req.body.id,
            {
                $set:{
                    fullName:req.body.fullName,
                    phoneNum:req.body.phoneNum,
                    district:req.body.district,
                    pincode:req.body.pincode,
                    city:req.body.city,
                    state:req.body.state,
                    houseNum:req.body.houseNum,
                }
            })
            if(address){
                res.redirect("/profile");
            }else{
                res.send("Somthing has happend Check the Console")
            }

    }catch(err){
        console.log(err);
        if(err){
            res.render("404page");
        }
    }
}

const changePassword=async(req,res)=>{
    try{
       


        res.render("changePassword")
    }catch(err){
        console.log(err);
        if(err){
            res.render("404page");
        }
    }
}

const updatePassword = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const findUser = await User.findById(userId);
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword; 
        
        const isPasswordMatch = await bcrypt.compare(currentPassword, findUser.password);
        
        if (isPasswordMatch) {
            if (newPassword === confirmPassword) {
                
                const changedPassword = await bcrypt.hash(newPassword,10);
                
               
                findUser.password = changedPassword ;
                await findUser.save();
                res.redirect("/profile")
            } else {
                console.log("New passwords don't match");
                res.redirect("/chagePassword")
            }
        } else {
            console.log("Current password is incorrect");
                res.redirect("/chagePassword");
        }
    } catch (err) {
        console.log(err);
        res.render("404page"); 
    }
};


const deleteAdd = async(req,res)=>{
    try{
        const addressId = req.query.id;
        const remove = await Address.findOneAndDelete({_id:addressId})
        if(remove){
            res.redirect("/profile");
        }else{
            res.render("404page");
        }

    }catch(err){
        console.log(err);
        if(err){
            res.render("404page");
        }
    }
}

const editProfile= async(req,res)=>{
    try{
        const userId= req.session.user_id;
        const name = req.body.userName;
        const phoneNum = req.body.phoneNum;

        const profile = await User.findByIdAndUpdate(userId,{
                $set:{
                    userName:name,
                    phoneNum:phoneNum
                }
        });
        if(profile){
            res.redirect("/profile"); 
        }
    }catch(err){
        console.log(err);
        if(err){
            res.render("404page");
        }
    }
}


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAYId,
    key_secret: process.env.RAZORPAYSECRET,
});

const addWallet = async (req, res) => {
    try {
      const amount = req.body.amount;
      console.log(amount);
  
      var options = {
        amount: amount * 100,
        currency: "INR",
        receipt: "order_receipt_" + Date.now(),
        payment_capture: 1,
      };
  
      razorpay.orders.create(options, (err, data) => {
        if (err) {
          console.error("Razorpay order creation failed:", err.message);
          return res
       
            .status(500)
            .json({ status: false, message: "Razorpay order creation failed" });
        }

        console.log('OK perfex')
  
        return res.status(200).json({ order: data });
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const updateWallet = async (req, res) => {
    try {
      console.log("Inside updateWallet function");
      const userId = req.session.user_id;
      const { amount } = req.body;
      console.log(amount);
  
      const updatewallet = await User.findByIdAndUpdate(
        userId,
        {  
          $inc: { wallet: amount/100 }, 
          $push: {
            history: {
              amount: amount/100,
              status: "credit",
              reason: "Add Cash to Wallet",
              timestamp: Date.now(),
            },
          },
        },
        { new: true }
      );
  
      if (updatewallet) {
        res.status(200).json({});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error"});
  }
  };

const refer= async(req,res)=>{
    try{
        console.log("Called referal server");
        const userId = req.session.user_id;
        const user = await User.findById(userId);
        console.log(user);
        const referalCode = user.referalCode;
        console.log(referalCode, "//////");
    
        if (referalCode) {
          res.json({ referalCode });
        } else {
          console.log("Dond get referalCode");
        }
    
    }catch(err){
        console.log(err);
        if(err){
            res.render("404page")
        }
    }
}


module.exports={
    profile,
    address,
    getAddress,
    updateAdd,
    editAdd,
    changePassword,
    updatePassword,
    deleteAdd,
    editProfile,
    updateWallet,
    addWallet,
    refer,
    updateAddd,
    editAddd,
    updateProfileAdd
}