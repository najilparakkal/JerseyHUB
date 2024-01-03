const User = require("../models/userModels");
const { sendOtp } = require("../models/nodemailer");
const Product = require("../models/productModels")
const bcrypt = require('bcryptjs');
const Cart = require("../models/cart")


const loadRegister = async (req, res) => {
    try {
        if (req.session.user_id) {
            res.redirect('/homepage')
        } else {
            res.render("userLogin", { message: "", errMessage: "" })
        }
    } catch (error) {
        console.log(error);
    }
}



const loadCreateUser = async (req, res) => {
    try {
        req.session.referalCode = req.query.code
        console.log(req.session.referalCode, "❤️❤️");
        res.render("createUser", { message: "", errMessage: "" })
    } catch (error) {
        console.log(error);
    }
}

//    createing a user


const insertUser = async (req, res) => {
    try {
        const email = req.body.email;
        const checkData = await User.findOne({ email: email });
        const referalCode = req.session.referalCode;

        if (checkData) {
            res.render("createUser", {
                errMessage: "User already found",
                message: "",
            });
        } else {
            function generateRandomReferralCode() {
                return Math.floor(100000 + Math.random() * 900000).toString();
            }

            const referralCode = generateRandomReferralCode();

            const user = new User({
                userName: req.body.userName,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                phoneNum: req.body.phoneNum,
                referalCode: referralCode,
            });

            console.log(referalCode, "👌👌");
            if (referalCode) {
                console.log("User get with Refferal invitation");
                // Find the user associated with the referral code
                const referredByUser = await User.findOne({ referalCode: referalCode });
                if (referredByUser) {



                    let newUserAmount = 200
                    let oldUserAmount = 200
                    const updatewallet = await User.findByIdAndUpdate(
                        referredByUser.id,
                        {
                            $inc: { wallet: oldUserAmount / 100 },
                            $push: {
                                history: {
                                    amount: oldUserAmount,
                                    status: "Reffering",
                                    reason: "You Refferd a User",
                                    timestamp: Date.now(),
                                },
                            },
                        },
                        { new: true }
                    );



                    user.wallet += newUserAmount;
                    user.history = {
                        amount: newUserAmount,
                        status: "Reffering",
                        reason: "Refferd  User",
                        timestamp: Date.now(),
                    }

                    await user.save();

                }
            } else {
                console.log("User get without Refferal invitation");
            }

            const userData = await user.save();

            req.session.otp = sendOtp(user.email);
            req.session.userData = user;

            res.redirect("/otp");
            console.log(req.session.otp);
        }
    } catch (error) {
        console.log(error.message);
    }
};

const loadOtp = (req, res) => {
    if (req.session.userData) {
        res.render("otp");

    } else {
        res.redirect("/homePage")
    }
}


const verifyOtp = async (req, res) => {
    try {
        console.log(req.session.otp, '💕💕');
        if (req.body.otp) {
            if (req.session.otp === req.body.otp) {
                res.redirect("/userLogin");
            } else {
                return res.status(400).send("Enter the OTP")
            }
        }
    } catch (err) {
        console.log(err);
    }
}

// Verifying a User



const verifyingUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });
        if (userData) {
            // Compare the entered password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                res.redirect("/homepage");
            } else {
                res.status(400).render("userLogin");
            }
        } else {
            res.redirect("/userLogin");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(`Internal Server Error: ${err.message}`);
    }
};




const loadMainPage = async (req, res) => {
    try {
        if (req.session.user_id) {
            res.redirect('/homepage')
        } else {
            console.log("else worked");
            res.render("mainPage");
        }
    } catch (err) {
        console.log(err);
    }
}


const loadHomePage = async (req, res) => {
    try {
        if (req.session.user_id) {
            const product = await Product.find({ isListed: true })
            const intermiami = await Product.findOne({ name:'Inert Miami', isListed: true });
            const alhilal = await Product.findOne({ name:'Al Hilal', isListed: true });
            const realmandrid = await Product.findOne({ name:"RealMandrid", isListed: true });

            console.log(intermiami,alhilal,realmandrid,"😘😘");

            res.render("homePage", { product ,realmandrid,alhilal,intermiami});
        } else {
            res.redirect('/mainpage')
        }
    } catch (err) {
        console.log(err);
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.user_id = null;
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

const product = async (req, res) => {
    try {



        const productId = req.query.id;

        const productdetails = await Product.findById(productId);

        res.render("productPage", {
            userId: req.session.user_id ? req.session.user_id : "",
            productdetails,
        });
    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page")
        }
    }
}







const searchProduct = async (req, res, next) => {
    try {


        const filter = req.query.q;

        if (filter != '') {
            const regex = new RegExp(filter, "i");
            const products = await Product.find({ name: { $regex: regex } });

            if (products) {
                res.json(products)
            }
        }
    } catch (error) {
        console.log(error);
    }
}




const cartQuantityUpdate = async (req, res) => {
    try {
        const userId = req.session.user_id;
        let cart = await Cart.findOne({ user: userId });
        const itemIndex = cart.items.findIndex(item => item.products.toString() === req.params.id);
        const product = await Product.findById(req.params.id);
        const quantityChange = parseInt(req.query.change);
        if (quantityChange) {
            // Ensuring the quantity doesn't go below 1
            if (cart.items[itemIndex].quantity === 1 && quantityChange === -1) {
                res.json({ success: true, quantity: cart.items[itemIndex].quantity, total });
            } else {
                cart.items[itemIndex].quantity += quantityChange;
                await cart.save();

                const total = cart.items[itemIndex].quantity * product.offerPrice;
                res.json({ success: true, quantity: cart.items[itemIndex].quantity, total });
            }
        } else {
            res.status(400).json({ success: false, message: 'Invalid quantity change' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const about = async(req,res)=>{
    try{
        const userId = req.session.user_id
        res.render("about")
    }catch(err){
        console.log(err);
        if(err){
            res.render('404page')
        }
    }
}

const contact = async (req,res)=>{
    try{
        res.render("contact")
    }catch(err){
        console.log(err);
        if(err){
            res.render("404page")
        }
    }
}


module.exports = {
    loadRegister,
    insertUser,
    loadMainPage,
    loadCreateUser,
    verifyingUser,
    loadHomePage,
    userLogout,
    loadOtp,
    verifyOtp,
    product,
    searchProduct,
    cartQuantityUpdate,
    about,
    contact
}