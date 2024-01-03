const express = require("express")
const adminRouter = express();
const nocache = require("nocache");
const logger = require("morgan");
const session = require("express-session");
const config = require("../config/config");
const bodyParser = require("body-parser");


const { upload } = require("../multer/multer");


adminRouter.use(session({
    secret: config.sessionSecretId,
    resave: false,
    saveUninitialized: true
}));
adminRouter.use(nocache());
adminRouter.use(logger("dev"));
adminRouter.set("view engine", "ejs");
adminRouter.set("views", "./views/admin");
adminRouter.use(bodyParser.json());
adminRouter.use(bodyParser.urlencoded({ extended: true }));


const auth = require("../middleware/adminAuth");
const adminController = require("../controllers/adminControllers");


adminRouter.get("/", auth.isLogout, adminController.loadLogin)
adminRouter.post("/", auth.isLogout, adminController.verifyAdmin)
adminRouter.get("/home", auth.isLogin, adminController.loadMainPage)
adminRouter.get("/logoutAdmin", auth.isLogin, adminController.logoutAdmin)


////////////////////////////////////////////////////////////////////////////////////////users List

adminRouter.get("/users", auth.isLogin, adminController.usersList)
adminRouter.get("/block", auth.isLogin, adminController.block)
adminRouter.get("/unBlock", auth.isLogin, adminController.unBlock)

/////////////////////////////////////////////////////////////////////////////////////////category

adminRouter.get("/categories", auth.isLogin, adminController.categories)
adminRouter.post("/addCategory", auth.isLogin, adminController.addCategory)
adminRouter.get("/category/block", auth.isLogin, adminController.blockCategory)
adminRouter.get("/category/unBlock", auth.isLogin, adminController.unBlockCategory)
adminRouter.get("/editCategory", auth.isLogin, adminController.editCategory)
adminRouter.post("/updateingCategory", auth.isLogin, adminController.updatCategory)
adminRouter.get("/deleteCategory", auth.isLogin, adminController.deleteCategory)
adminRouter.post("/updateCategoryOffer",auth.isLogin,adminController.updateCategoryOffer)

/////////////////////////////////////////////////////////////////////////////////////////////product 

adminRouter.get("/productList", auth.isLogin, adminController.productList)
adminRouter.get("/createProduct", auth.isLogin, adminController.loadCreateingProduct)
adminRouter.post("/createProduct", upload.fields([{ name: "coverimage", maxCount: 1 }, { name: "images" }]), auth.isLogin, adminController.createProduct)
adminRouter.get("/blockProduct", auth.isLogin, adminController.blockProduct)
adminRouter.get("/unblockproduct", auth.isLogin, adminController.unblockproduct)
adminRouter.get("/editProduct", auth.isLogin, adminController.editProduct)
adminRouter.post("/updateProduct", upload.fields([{ name: "coverimage", maxCount: 1 }, { name: "images" }]), auth.isLogin, adminController.updateProduct)
adminRouter.get("/deletProduct", auth.isLogin, adminController.deletProduct)
adminRouter.get('/removeImage',auth.isLogin,adminController.removeImage)
adminRouter.post("/changeimage", upload.single('image'), adminController.changeimage);
adminRouter.post("/changeCoverImage", upload.single('coverImage'), adminController.changeCoverImage);

//////////////////////////////////////////////////////////////////////////////////////////////order

adminRouter.get("/orders",auth.isLogin,adminController.orders)
adminRouter.get("/detail",auth.isLogin,adminController.orderDetail)
adminRouter.get("/orderCancel",auth.isLogin,adminController.cancelOrder)
adminRouter.get("/orderPending",auth.isLogin,adminController.orderPending)
adminRouter.get("/orderDelivered",auth.isLogin,adminController.orderDelivered)
adminRouter.get("/orderConform",auth.isLogin,adminController.orderConfirm)

////////////////////////////////////////////////////////////////////////////////////////////sales Report 

adminRouter.get("/report",auth.isLogin,adminController.salesReport)
adminRouter.get("/showSales",auth.isLogin,adminController.showSales);
adminRouter.post("/generatePdf",auth.isLogin,adminController.pdfDownload)
adminRouter.post("/generateExcel",adminController.generateExcel)
module.exports = adminRouter;