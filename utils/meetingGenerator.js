const passport = require("passport");
const config = require("config");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const Meeting = require("google-meet-api").meet;

const clientId = config.get("googleKeys.clientId");
const clientSecret = config.get("googleKeys.clientSecret");
passport.use(
  new GoogleStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "http://localhost:3003/auth/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(accessToken, refreshToken, profile);
      Meeting({
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        date: "2020-12-01",
        time: "10:59",
        summary: "summary",
        location: "location",
        description: "description",
        checking: 0,
      })
        .then(function (result) {
          console.log("Link ", result);
        })
        .catch((error) => {
          console.log(error);
        });
      return cb();
    }
  )
);

module.exports = function (app) {
  app.get(
    "/auth/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3003",
    })
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "https://www.googleapis.com/auth/calendar"],
      accessType: "offline",
      prompt: "consent",
    })
  );

  app.get("/", function (req, res) {
    res.send("done");
  });
};
