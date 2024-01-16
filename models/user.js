const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  username: {type: String, required: true, minLength: 3, maxLength: 15},
  password: {type: String, required: true, minLength: 8},
  email: {type: String, required: true}
});

UserSchema.methods.validPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema)