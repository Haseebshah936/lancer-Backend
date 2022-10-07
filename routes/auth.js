const router = require('express').Router();

const {signup, login, remove, googleAuth, refreshToken} = require('../controllers/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/delete/:id', remove);
router.post('/google', googleAuth);
router.post('/google/refreshToken', refreshToken);

module.exports = router;