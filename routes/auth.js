var express = require('express');
const passport = require('passport');
var router = express.Router();

//Require controller modules
const auth_controller = require('../controllers/authController');


router.post('/login', auth_controller.login);

router.get('/logout', auth_controller.logout);

router.get('/user', auth_controller.user);



module.exports = router;