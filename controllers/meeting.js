const config = require("config");
const clientId = config.get("googleKeys.clientId");
const clientSecret = config.get("googleKeys.clientSecret");
const { logger } = require("../utils/logger");
const Meeting = require("google-meet-api").meet;
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");

const oAuth2Client = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri: "postmessage",
});

const generateMeeting = async (req, res) => {
  try {
    const { code, date, time, summary, location, description } = req.body;
    console.log("date", date.replaceAll("/", "-"), "time", time, "code", code);
    const auth = await oAuth2Client.getToken(code); // exchange code for tokens
    const tokens = auth.tokens;
    // console.log("Token ", tokens);
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });
    // console.log("Ticket ", ticket);
    const result = await Meeting({
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: tokens.refresh_token,
      date: date.replaceAll("/", "-"),
      time,
      summary: "summary",
      location: "location",
      description: "description",
      checking: 0,
    });
    console.log("Link ", result);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  generateMeeting,
};
