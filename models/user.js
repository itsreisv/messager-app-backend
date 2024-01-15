const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, required: true, minLength: 3, maxLength: 15},
  password: {type: String, required: true, minLength: 8},
  email: {type: String, required: true}
});

module.exports = mongoose.model("User", UserSchema)