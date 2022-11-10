const { getUser } = require("../controllers/user");

const router = require("express").Router();

router.get("/:email", getUser);

module.exports = router;
