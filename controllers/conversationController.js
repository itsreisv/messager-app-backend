const Conversation = require('../models/conversation');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose')


//GET all conversations depending on username
exports.get_conversations = asyncHandler(async (req, res, next) => {

  try {
    const conversations = await Conversation.find({
      $or: [
        { usernameOne: req.params.username },
        { usernameTwo: req.params.username },
      ]
    });
    res.json({ conversations })
  } catch (err){
    return next(err)
  }
})

//POST create new conversation
exports.create_conversation = asyncHandler(async (req, res, next) => {
  const data = req.body;

  //Check if username is not provided
  if (!data.usernameTwo) {
    return res.status(400).json({ error: 'usernameTwo is required'})
  }

  //Check if users are the same
  if (data.username === data.usernameTwo) {
    return res.status(400).json({ error: 'Cannot start a conversation with yourself.'})
  }

  try {
    //Check if conv already exists
    const existingConversation = await Conversation.findOne({
      $or: [
        { usernameOne: data.username, usernameTwo: data.usernameTwo },
        { usernameOne: data.usernameTwo, usernameTwo: data.username },
      ],
    });

    if (existingConversation) {
      return res.status(400).json({ error: 'Conversation already exists.'})
    }

    const newConversation = new Conversation({
      usernameOne: data.username,
      usernameTwo: data.usernameTwo,
      conversation: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    })
    await newConversation.save();
    res.json({ message: 'Conversation created successfully'})
  } catch (err) {
   return next(err) 
  }
})

exports.send_message = asyncHandler(async (req, res, next) => {
  try {
    const { sender, text } = req.body;
    const conversation = await Conversation.findById(req.body.conversationId);
    if (!conversation) {
      throw new Error('Conversation not found')
    }
    conversation.messages.push({ sender, text });
    await conversation.save();
  } catch (error) {
    throw error;
  }
})