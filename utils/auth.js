const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = {
    session,
    passport,
    passportLocalMongoose,
    GoogleStrategy,
    findOrCreate
}