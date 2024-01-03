require("dotenv").config()


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB);


const express = require('express');
const app = express();


app.set("view engine","ejs");
app.set("views",'./views/users');
app.use(express.static('public'));

//user

const userRouter = require('./routes/userRouter');
app.use('/', userRouter);

//admin

const adminRouter = require("./routes/adminRouter");
app.use("/admin", adminRouter)


//404 page  




app.use((req, res, next) => {
    res.status(404).render('404page');
    });

app.listen(process.env.PORT, () => console.log('Server is running...'))