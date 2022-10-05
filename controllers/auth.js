const mongoose = require('mongoose');
const User = require("../models/user");
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

module.exports = {
    signup,
    login,
    remove
}