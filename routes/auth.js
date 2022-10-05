const router = require('express').Router();

const {signup, login, remove} = require('../controllers/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/delete/:id', remove);

module.exports = router;