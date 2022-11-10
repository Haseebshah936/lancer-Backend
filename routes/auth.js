const router = require("express").Router();

const {
  signup,
  login,
  remove,
  googleSignup,
  googleLogin,
  refreshToken,
  facebookSignup,
  facebookLogin,
} = require("../controllers/auth");

router.post("/signup", signup);
router.post("/login", login);
router.delete("/delete/:id", remove);
router.post("/google/signup", googleSignup);
router.post("/google/login", googleLogin);
router.post("/google/refreshToken", refreshToken);
router.post("/google/callback", refreshToken);
router.post("/facebook/signup", facebookSignup);
router.post("/facebook/login", facebookLogin);

module.exports = router;
