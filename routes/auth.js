const router = require('express').Router();

const {signup} = require('../controllers/auth');

router.get('/signup', signup);

module.exports = router;