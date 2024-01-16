const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const bcrypt = require('bcryptjs')


exports.login = asyncHandler(async (req, res, next) => {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Check if the entered password matches the hashed password in the database
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

exports.logout = asyncHandler(async (req, res, next) => {
  req.logout(function(err) {
    if (err) {return next(err); }
    return res.json({ message: 'Logout successful'})
  })
})

exports.user = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user })
  } else {
    res.status(401).json({ error: 'Unauthorized'})
  }
})