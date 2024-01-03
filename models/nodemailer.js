const nodemailer = require("nodemailer");
require("dotenv").config();
const randomString =require("randomstring");
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.NODEMAILEREMAI,
        pass: process.env.NODEMAILERPASS
    }
});

function sendOtp(email){
    const otp = randomString.generate({
        length:6,
        charset:"numeric"
    })
    const mailOption ={
        from:"JERSEY HUB",
        to:email,
        subject:"WELCOM TO JERSEY HUB",
        text:`Your OTP is : ${otp}`
    }

    transporter.sendMail(mailOption,function(err,info){
        if(err){
            console.log(err);
        }else{
            console.log(`Email sent:`+info.response);
        }
    });

    return otp

}

module.exports={sendOtp}