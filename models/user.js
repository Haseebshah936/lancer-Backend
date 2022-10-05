const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
    },
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);