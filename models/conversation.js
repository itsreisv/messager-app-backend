const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Message = require('../models/message');


const ConversationSchema = new Schema({
  usernameOne: {type: String, required: true},
  usernameTwo: {type: String, required: true},
  messages: [Message.schema],
})

module.exports = mongoose.model("Conversation", ConversationSchema)