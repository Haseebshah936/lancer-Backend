const mongoose = require("mongoose");
const { findOrCreate} = require("../utils/auth");

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
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
    emailVerified: {type:Boolean, default: false},
    googleId: {type: String, default: null},
    facebookId: {type: String, default: null},
    twitterId: {type: String, default: null},
    role: {type: String, default: "user"},
    profilePic:{type:String, default:""},
    about:{type:String, default:""},
    country:{type:String, default:""},
    currecny:{type:String, default:"USD"},
    seller: {type: Boolean, default: false},
    recentSearchs: [{type: String, default: ""}],
    skills: [{type: String, default: ""}],
    followers:[{type:mongoose.Types.ObjectId, ref:"User"}],
    following:[{type:mongoose.Types.ObjectId, ref:"User"}],
    gigs:[{type:mongoose.Types.ObjectId, ref:"Gig"}],
    orders:[{type:mongoose.Types.ObjectId, ref:"Order"}],
    reviews:[{type:mongoose.Types.ObjectId, ref:"Review"}],
    responseTime: {type: Number, default: 0},
    stars:{type: Number, default: 5},
    createdAt: {type: Date, default: Date.now},
})
// userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);
module.exports = User;