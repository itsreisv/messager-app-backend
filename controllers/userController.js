const User = require('../models/user');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  res.send('USER INDEX NOT IMPLEMENTED')
});

//GET all users
exports.user_create_get = asyncHandler(async (req, res, next) => {
  const all_users = await User.findOne({});
  return res.send(all_users)
})


//POST check user exists and create new user
exports.user_check_exists = asyncHandler(async (req, res, next) => {
  const userData = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username: userData.username }, {email: userData.email }] });
    if (existingUser) {
      res.status(400).json({ error: 'Username or email in use '});
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = new User({
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
      })
      await newUser.save();
      res.json({ message: 'User created successfully' });
    }
  } catch(error) {
    return next(error)
  }
});
    

