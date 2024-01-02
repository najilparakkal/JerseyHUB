const express=require("express");
const userRouter=express();
const nocache=require("nocache");
const logger=require("morgan");
const bodyParser=require("body-parser");
const session=require("express-session");
const bcrypt=require("bcryptjs");





const auth=require("../middleware/authentication");
const userController=require("../controllers/userControllers");
const config=require("../config/config");
const cartController=require("../controllers/cartController")
const profileController= require("../controllers/profileController")
const checkOutController = require("../controllers/checkOutContoller")
const shopeController = require("../controllers/shopeController")



userRouter.use(nocache());
userRouter.use(session({
    secret:config.sessionSecretId,
    resave:false,
    saveUninitialized:true
}))
userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({extended:true}));
userRouter.use(logger("dev"));

 
userRouter.set("view engine","ejs");
userRouter.set("views",'./views/users');

 

 
userRouter.get("/",userController.loadMainPage);

userRouter.get("/homepage",userController.loadHomePage)

userRouter.get("/userLogin",userController.loadRegister)
userRouter.post("/userLogin",auth.isLogout,userController.verifyingUser)
userRouter.get("/otp",userController.loadOtp)
userRouter.post("/otpVerification",userController.verifyOtp)
  
userRouter.get("/usercreate",auth.isLogout,userController.loadCreateUser)
userRouter.post('/usercreate',userController.insertUser)

userRouter.get("/logout",auth.isLogin,userController.userLogout)
 
userRouter.get("/product",auth.isLogin,userController.product)


//cart

userRouter.get("/addToCart",auth.isLogin,cartController.addToCart)
userRouter.post("/addToCartProduct",auth.isLogin,cartController.addToCart)
userRouter.get("/cart",auth.isLogin,cartController.cart)
userRouter.post("/quantity/:id",auth.isLogin,cartController.dicQuantity)
userRouter.post("/quantityinc/:id",auth.isLogin,cartController.incQuantity)
userRouter.get("/getProductPrice/:id",auth.isLogin,cartController.productPrice)
userRouter.get('/getCartTotal/:cartId', auth.isLogin, cartController.getCartTotal);
userRouter.post("/removeproduct",auth.isLogin,cartController.removeProduct)
userRouter.put("/updateQuantity/:id",auth.isLogin,userController.cartQuantityUpdate);

//profile

userRouter.get("/profile",auth.isLogin,profileController.profile)
userRouter.get("/address",auth.isLogin,profileController.address)
userRouter.post("/address",auth.isLogin,profileController.getAddress)
userRouter.get("/editadd",auth.isLogin,profileController.editAdd)
userRouter.get("/editAdd",auth.isLogin,profileController.editAddd)

userRouter.post("/updateadd",auth.isLogin,profileController.updateAdd)
userRouter.post("/updateAdd",auth.isLogin,profileController.updateAddd)

userRouter.get("/changePassword",auth.isLogin,profileController.changePassword)
userRouter.post("/changePassword",auth.isLogin,profileController.updatePassword)
userRouter.get("/deleteadd",auth.isLogin,profileController.deleteAdd)
userRouter.post("/updateProfile",auth.isLogin,profileController.editProfile)
userRouter.post("/addWallet", profileController.addWallet);
userRouter.post("/updatewallet", profileController.updateWallet);
userRouter.get("/refer",auth.isLogin,profileController.refer)
 
//checkOut
// remember
userRouter.get("/checkOut",auth.isLogin,checkOutController.checkOut)
userRouter.get("/editCartAdd",auth.isLogin,checkOutController.editCartAdd)
userRouter.get("/itemCheckOut",auth.isLogin,checkOutController.itemCheckOut)

userRouter.get("/deleteCartAdd",auth.isLogin,checkOutController.deleteCartAdd)
userRouter.post("/updateCartAdd",auth.isLogin,checkOutController.updateCartAdd)
userRouter.get("/checkOutAdd",auth.isLogin,checkOutController.checkOutAdd)
userRouter.post("/checkOutAdd",auth.isLogin,checkOutController.getCheckOutAdd)


userRouter.post("/placeOrder",auth.isLogin,checkOutController.placeOrder)
userRouter.get("/orders",auth.isLogin,checkOutController.orders)
userRouter.post("/cancelOrder",checkOutController.cancelOrder);
userRouter.post("/razorpay",auth.isLogin,checkOutController.orderRazorpay)
userRouter.post("/removeProductOrder",checkOutController.removeProduct)
userRouter.post("/wallet",checkOutController.wallet)
userRouter.get("/invoice",checkOutController.invoice)

userRouter.get('/searchProduct',userController.searchProduct)
userRouter.get("/shope",auth.isLogin,shopeController.shope)

userRouter.get("/about",auth.isLogin,userController.about)

userRouter.get('/contact',auth.isLogin,userController.contact)
module.exports=userRouter;