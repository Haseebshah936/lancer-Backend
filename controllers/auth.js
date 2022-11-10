const mongoose = require("mongoose");
const { User } = require("../models/user");
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const config = require("config");
const clientId = config.get("googleKeys.clientId");
const clientSecret = config.get("googleKeys.clientSecret");
const argon2 = require("argon2");
const axios = require("axios");
const { logger } = require("../utils/logger");
const jwt = require("jsonwebtoken");

const oAuth2Client = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri: "postmessage",
});
const signup = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const encryptedPassword = await argon2.hash(password);
  const user = new User({
    name: "test1",
    email,
    password: encryptedPassword,
  });
  try {
    const savedUser = await User.findOne({ email });
    if (savedUser) return res.status(403).send("User already exists");
    const result = await user.save();
    res.status(201).send({
      email,
      password: encryptedPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    if (!(await argon2.verify(user.password, req.body.password)))
      return res.status(403).send("Incorrect password");
    // const { email,password, ...rest } = user._doc;
    console.log(user._doc);
    res.status(200).send(user._doc);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const remove = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(403).send("User not found");
    if (user.password == argon2.hash(req.body.password))
      return res.status(403).send("Incorrect password");
    await user.deleteOne();
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

const googleSignup = async (req, res) => {
  console.log("Body ", req.body);
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    }); // verify token
    const payload = ticket.getPayload();
    const user = await User.findOneAndUpdate(
      { email: payload.email },
      { googleId: payload.sub },
      { new: true }
    );
    if (!user) {
      const encryptedPassword = await argon2.hash(payload.sub);
      const newUser = new User({
        name: payload.name,
        email: payload.email,
        password: encryptedPassword,
        googleId: payload.sub,
        profilePic: payload.picture,
        emailVerified: true,
      });
      const response = await newUser.save();
      const { password, email, ...rest } = response._doc;
      res.status(201).send({ email, password });
      return;
    }
    res.status(403).send("User already exists");
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};
const facebookSignup = async (req, res) => {
  try {
    const { accessToken, id } = req.body;
    const { data } = await axios({
      url: `https://graph.facebook.com/${id}`,
      method: "get",
      params: {
        fields: [
          "id",
          "email",
          "first_name",
          "last_name",
          "picture.type(large)",
        ].join(","),
        access_token: accessToken,
      },
    });
    logger(data); // { id, email, first_name, last_name }
    const user = await User.findOneAndUpdate(
      { email: data.email },
      { facebookId: data.id },
      { new: true }
    );
    if (!user) {
      const encryptedPassword = await argon2.hash(data.id + "kingsman");
      const newUser = new User({
        name: data.first_name + " " + data.last_name,
        email: data.email,
        password: encryptedPassword,
        facebookId: data.id,
        profilePic: data.picture.data.url,
        emailVerified: true,
      });
      const response = await newUser.save();
      const { email, password, ...rest } = response._doc;
      res.status(201).send({ email, password });
      return;
    }
    // const { password, ...rest } = user._doc;
    // res.status(200).send({ ...user._doc });
    res.status(403).send("User already exists");
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
const googleLogin = async (req, res) => {
  console.log("Body ", req.body);
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    }); // verify token
    const payload = ticket.getPayload();
    const user = await User.findOneAndUpdate(
      { email: payload.email },
      { googleId: payload.sub },
      { new: true }
    );
    if (!user) return res.status(404).send("User not found");
    // const { password, ...rest } = user._doc;
    res.status(200).send({ ...user._doc });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};
const facebookLogin = async (req, res) => {
  try {
    const { accessToken, id } = req.body;
    const { data } = await axios({
      url: `https://graph.facebook.com/${id}`,
      method: "get",
      params: {
        fields: [
          "id",
          "email",
          "first_name",
          "last_name",
          "picture.type(large)",
        ].join(","),
        access_token: accessToken,
      },
    });
    logger(data); // { id, email, first_name, last_name }
    const user = await User.findOneAndUpdate(
      { email: data.email },
      { facebookId: data.id },
      { new: true }
    );
    if (!user) return res.status(404).send("User not found");
    // const { password, ...rest } = user._doc;
    res.status(200).send({ ...user._doc });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const refreshToken = async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.status(200).json(credentials);
};

const callback = () => {
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
    (req, res) => {
      // Successful authentication, redirect secrets.
      res.redirect("http://localhost:3000");
    };
};

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
  refreshToken,
  googleSignup,
  googleLogin,
  callback,
  facebookSignup,
  facebookLogin,
};
