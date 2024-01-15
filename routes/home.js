var express = require('express');
var router = express.Router();

//Require controller modules
const user_controller = require('../controllers/userController');

//GET home page
router.get('/', user_controller.index);

//POST new user
router.post('/sign-up', user_controller.user_check_exists);

//GET all users
router.get('/users', user_controller.user_create_get)



module.exports = router;