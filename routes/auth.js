const router = require('express').Router();

const {signup, login, remove, googleAuth, refreshToken, facebookAuth} = require('../controllers/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/delete/:id', remove);
router.post('/google', googleAuth);
router.post('/google/refreshToken', refreshToken);
router.post('/google/callback', refreshToken);
router.post('/facebook/', facebookAuth);

module.exports = router;