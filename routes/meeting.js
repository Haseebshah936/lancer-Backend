const { generateMeeting } = require("../controllers/meeting");

const router = require("express").Router();

router.post("/", generateMeeting);

module.exports = router;
