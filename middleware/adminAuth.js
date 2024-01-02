const isLogin=async(req,res,next)=>{
    try{
        if(req.session.admin_id){
            next();
        }
        else{
            res.redirect("/admin");
          
        }
    }catch(err){
        console.log(err);
      
    }
}

const isLogout=async(req,res,next)=>{
    try{
        if(req.session.admin_id){
            res.redirect("/admin/home");
        }  
        next()
    }catch(err){
        console.log(err);
    }
}

module.exports={
    isLogin,
    isLogout
}