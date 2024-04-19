const {register, login, updateProfile, changePassword, forgetPassword, resetPassword, getUser, getAllUser, logout, contactUs, userAuth, deleteUser, verifyOTP} = require("../controllers/userController");
const verifyAdminToken = require("../middleware/adminMiddleware");
const verifyToken = require("../middleware/userMiddleware");
const router =require("express").Router();


router.post("/register",register)
router.post("/verify-account",verifyOTP)
router.post("/login",login)
router.get("/verify",verifyToken,(req,res)=>res.send("Verified"))
router.put("/updateProfile",verifyToken,updateProfile)
router.put("/changePassword",verifyToken,changePassword)
router.put("/forget-password",forgetPassword)
router.post("/reset-password",resetPassword)
router.get("/getUser/:id",getUser);
router.get("/allUsers",getAllUser);
router.post("/contact",contactUs)
router.delete("/delete-user/:id",verifyAdminToken,deleteUser)
router.get("/logout",logout);
router.get("/verifyingUser",verifyToken,userAuth);

module.exports=router;