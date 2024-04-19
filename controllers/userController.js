const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cookie = require("cookie-parser");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const register = async (req, res) => {
  const { name, email, password, confirmPassword, contact, address, gender } =
    req.body;
  const otp = generateOTP(); // Generate OTP
  const otpExpire = new Date(+new Date() + 5 * 60 * 1000); // Set the OTP expiry to 5 minutes from now

  try {
    const isEmailAlready = await userModel.findOne({ email });
    if (isEmailAlready) {
      return res
        .status(400)
        .send({ success: false, error: "User Already Exist" });
    }

    const encrypt = await bcrypt.hash(password, 10);
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({
          success: false,
          error: "Password and Confirm Password should be the same",
        });
    }

    const newUser = new userModel({
      name,
      email,
      password: encrypt,
      confirmPassword: encrypt,
      address,
      gender,
      contact,
      avatar: {
        public_id: "adbjhsbjhdcdc",
        url: "cjsdnkjcdsc",
      },
      otp, // Store OTP temporarily
      otpExpire,
    });
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Account Verification",
      text: `Dear User,
      
              Thank you for registering with our application. To verify your account, please use the following code:
      
              Verification Code: ${otp}
      
              If you did not register for an account, please ignore this email.
      
              Thank you for choosing our service.
      
              Regards,
              Your Application Team`,
    };

    await transporter.sendMail(mailOptions);
    await newUser.save();
    res.status(200).send({ success: true, user: newUser, otpSent: true });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).send({ success: false, error: validationErrors });
    }

    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({ success: false, error: "User not found" });
    }

    if (user.verified) {
      return res
        .status(400)
        .send({ success: false, error: "User already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).send({ success: false, error: "Invalid OTP" });
    }

    // Update the verified field to true
    user.verified = true;
    user.otp = null;
    await user.save();

    res
      .status(200)
      .send({
        success: true,
        message: "User registered and verified successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, error: "INVALID CREADTIAL" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .send({ success: false, error: "INVALID CREADTIAL" });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    // res.cookie('token',token)
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    user.token = token;
    await user.save();
    res.status(200).send({ success: true, logIn: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// const updateProfile=async(req,res)=>{
//     console.log(req.user.userId);
//     try {
//         const user=await userModel.findByIdAndUpdate(req.user.userId,req.body);
//         console.log(user);
//         res.status(200).send({success:true,UpdatedProfile:user})
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({success:false,error:"Internal Server Error"})
//     }
// }

const updateProfile = async (req, res) => {
  console.log(req.user.userId);
  try {
    const user = await userModel.findByIdAndUpdate(req.user.userId, req.body, {
      new: true,
    });
    console.log(user);
    if (!user) {
      return res.status(404).send({ success: false, error: "User not found" });
    }
    res.status(200).send({ success: true, UpdatedProfile: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .send({ success: false, error: "Enter Required Fields" });
    }

    const user = await userModel.findById(req.user.userId);

    const verifyOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!verifyOldPassword) {
      return res
        .status(400)
        .send({ success: false, error: "Old Password is Incorrect" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .send({
          success: false,
          error: "New Password and Confirm Password should be same...",
        });
    }
    const encrypt = await bcrypt.hash(newPassword, 10);
    user.password = encrypt;
    user.confirmPassword = encrypt;
    await user.save();
    res.status(200).send({ success: true, user: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Error" });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    // console.log(user)
    if (!user) {
      return res.status(400).send({ success: false, error: "INVALID USER" });
    }

    const randomToken = await jwt.sign({ email }, process.env.RESET_TOKEN, {
      expiresIn: "3m",
    });
    // const resetTokenExpiration=Date.now()+300000;

    user.resetPasswordToken = randomToken;
    // user.resetPasswordExpire=resetTokenExpiration;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password?token=${randomToken}`;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Password",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({
        success: true,
        message: `Reset Password's Link sent to Email`,
        user: user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword, confirmPassword } = req.body;
  try {
    const user = await userModel.findOne({ resetPasswordToken: token });
    const encrypt = await bcrypt.hash(newPassword, 10);
    const match = await bcrypt.compare(confirmPassword, encrypt);

    if (!match) {
      return res
        .status(400)
        .send({
          success: false,
          error: "New Password and Confirm Password should be same",
        });
    }

    user.resetPasswordToken = "";
    user.password = encrypt;
    user.confirmPassword = encrypt;
    const updatedPassword = await user.save();
    res.status(200).send({ success: true, UpdatedUser: updatedPassword });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Internal Server" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).send({ success: false, error: "No Such User" });
    }
    res.status(200).send({ success: true, User: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();
    if (users.length < 1) {
      return res
        .status(200)
        .send({ success: true, Message: "No User Till Now.." });
    }
    res.status(200).send({ success: true, Users: users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

const contactUs = async (req, res) => {
  const { name, email, phone, place, message } = req.body;

  try {
    const user = await userModel.find({ email });
    console.log(user);

    if (!user) {
      return res
        .status(400)
        .send({ success: false, error: "User is Not registered " });
    }

    // Check if the message is empty or less than 10 characters
    if (!message || message.length < 10) {
      return res
        .status(400)
        .send({
          success: false,
          error: "Enter at least 10 letters in the message",
        });
    }

    const mailOptions = {
      from: email,
      to: process.env.SMTP_USER,
      subject: `Hey MuscleSharks: A new message from ${name}`,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .send({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

const logout = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(400)
        .send({ success: false, error: "Token not available" });
    }

    res.clearCookie("token");
    res.status(200).send({ success: true, message: "Log Out Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

const userAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.decode(token);
    // console.log(decodedToken.userId);
    const user = await userModel.findById(decodedToken.userId);
    if (!user) {
      return res
        .status(400)
        .send({ success: false, error: "User Not in DataBase" });
    }
    return res.status(200).send({ success: true, user: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// const userAuth=async(req,res)=>{

// }

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).send({ success: false, error: "User Not Found" });
    }
    await userModel.findByIdAndDelete(id);
    res.status(200).send({ success: true, user: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ sucess: false, error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  updateProfile,
  changePassword,
  forgetPassword,
  resetPassword,
  getUser,
  getAllUser,
  logout,
  contactUs,
  userAuth,
  deleteUser,
  verifyOTP,
};
