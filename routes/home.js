var express = require('express');
var router = express.Router();

//Require controller modules
const user_controller = require('../controllers/userController');
const conversation_controller = require('../controllers/conversationController')

//GET home page
router.get('/', user_controller.index);

//POST new user
router.post('/sign-up', user_controller.user_check_exists);

//GET all users
router.get('/users', user_controller.user_create_get)

//POST conversation
router.post('/conversation', conversation_controller.create_conversation);

//GET conversations
router.get('/conversations/:username', conversation_controller.get_conversations);

router.post('/conversations/send', conversation_controller.send_message);



module.exports = router;