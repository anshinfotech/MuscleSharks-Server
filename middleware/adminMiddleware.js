// const jwt = require('jsonwebtoken');

// const generateToken = (adminId) => {
//   return jwt.sign({ adminId }, process.env.SECRET_KEY, { expiresIn: '1h' }); // Change the expiration time as needed
// };





// // const authenticateAdmin = (req, res, next) => {
// //   const token = req.cookies.adminToken;
// // //   console.log(token);

// //   if (!token) {
// //     return res.status(401).json({ message: 'Unauthorized' });
// //   }

// //   jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
// //     if (err) {
// //       return res.status(401).json({ message: 'Unauthorized' });
// //     }

// //     req.adminId = decodedToken.adminId;
// //     next();
// //   });
// // };

// // module.exports = { generateToken, authenticateAdmin };


// // const jwt = require('jsonwebtoken');

// // const generateToken = (adminId, userDetails) => {
// //     return jwt.sign({ adminId, userDetails }, process.env.SECRET_KEY, { expiresIn: '1h' });
// // };

// const authenticateAdmin = (req, res, next) => {
//     const token = req.cookies.adminToken;

//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
//         if (err) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         req.adminId = decodedToken.adminId;
//         req.userDetails = decodedToken.userDetails; // Add this line to access user details
//         next();
//     });
// };

// module.exports = { generateToken, authenticateAdmin };



const jwt=require("jsonwebtoken")
require("dotenv").config()



const verifyAdminToken=async(req,res,next)=>{
    // const token=req.headers.authorization.split(' ')[1];
    const token=req.cookies.adminToken;
    try {
        const verified=await jwt.verify(token,process.env.SECRET_KEY);

        if(verified){
            req.admin=verified;
            next();
        }else{
            return res.status(400).send({success:false,error:"Token is Invalid"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
}


module.exports=verifyAdminToken;