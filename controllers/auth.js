const mongoose = require('mongoose');
const User = require("../models/user");
const {OAuth2Client, UserRefreshClient} = require("google-auth-library")
const  clientId= "30719619583-j2d2baepb0dkbscqrm3661mb6bomooch.apps.googleusercontent.com"
const clientSecret= "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"
const oAuth2Client = new OAuth2Client({
    clientId: "30719619583-j2d2baepb0dkbscqrm3661mb6bomooch.apps.googleusercontent.com",
    clientSecret: "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",
    "postMessage": true,
})
const signup = async (req, res) => {
    const {username, email,password} = req.body;
    const user = new User({
        name: username,
        email,
        password,
    })
    try {
        const savedUser = await User.findOne({email});
        if(savedUser) return res.status(403).send("User already exists");
        const result = await user.save();
        const {password, ...rest} = result._doc;
        res.status(201).send({
            ...rest
        })
    } catch (error) {
        res.status(500).send(error);
    }
}

const login = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).send("User not found");
        if(user.password !== req.body.password) return res.status(403).send("Incorrect password");
        const {password, ...rest} = user._doc;
        res.status(200).send({
            ...rest
        })
    } catch (error) {
        res.status(500).send(error);
    }
}

const remove = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(403).send("User not found");
        if(user.password !== req.body.password) return res.status(403).send("Incorrect password");
        await user.deleteOne();
        res.status(200).send("User deleted successfully");
    }
    catch(error){
        res.status(500).send(error);
    }
}

const googleAuth = async (req, res) => {
    console.log(req.body);
    try {
        const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
        console.log(tokens);
        res.status(200).json(tokens);
        
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
  }

 const refreshToken =  async (req, res) => {
    const user = new UserRefreshClient(
      clientId,
      clientSecret,
      req.body.refreshToken,
    );
    const { credentials } = await user.refreshAccessToken(); // optain new tokens
    res.status(200).json(credentials);
  }
  
// const forgotPassword = async (req, res) => {
//     try{
//         const {email} = req.body;
//         const user = await User.findOne({email});
//         if(!user) return res.status(403).send("User not found");
//         const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
//         const link = `http://localhost:3000/reset/${token}`;
//         const mailOptions = {
//             from: process.env.EMAIL,
//             to: email,
//             subject: "Reset Password",
//             html: `
//                 <h2>Please click on the given link to reset your password</h2>
//                 <p>${link}</p>
//             `
//         }
//         await transporter.sendMail(mailOptions);
//         res.status(200).send("Password reset link sent to your email");
//     }
//     catch(error){
//         res.status(500).send(error);
//     }
// }

// const resetPassword = async (req, res) => {
//     try{
//         const {token} = req.params;
//         const {password} = req.body;
//         const user = jwt.verify(token, process.env.JWT_SECRET);
//         const result = await User.findOneAndUpdate({_id: user._id}, {password});
//         res.status(200).send("Password updated successfully");
//     }
//     catch(error){
//         res.status(500).send(error);
//     }
// }

module.exports = {
    signup,
    login,
    remove,
    googleAuth,
    refreshToken
}