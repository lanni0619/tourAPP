const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./tourModel');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, 'A user name should more or equal then 3 characters.'],
    maxlength: [15, 'A user name should less or equal then 15 characters.'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email format is not correct.'],
  },
  photos: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Passowrd should more or equal then 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
