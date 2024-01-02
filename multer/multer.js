const multer = require("multer");
const path = require("path");


const products = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"public/product/");
    },
    filename:function(req,file,callback){
        let filename = file.originalname+" "+Date.now();
        if(!req.session.images){
            req.session.images=[];
        }
            req.session.images.push(filename);

            callback(null,filename);
    }
})

const upload = multer({storage:products});
module.exports={upload}