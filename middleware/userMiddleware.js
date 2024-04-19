const jwt=require("jsonwebtoken")
require("dotenv").config()



const verifyToken=async(req,res,next)=>{
    // const token=req.headers.authorization.split(' ')[1];
    const token=req.cookies.token;
    try {

        if(token===undefined){
            return res.status(400).send({success:false,error:"Log In First"})
        }

        const verified=await jwt.verify(token,process.env.SECRET_KEY);

        if(verified){
            req.user=verified;
            next();
        }else{
            return res.status(400).send({success:false,error:"Token is Invalid"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}


module.exports=verifyToken;