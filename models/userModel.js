const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    // [ !!! ] This only works on "create" & "save".
    validate: {
      validator: function (confirm) {
        return confirm === this.password;
      },
      message: 'Password and passwordConfirm should be the same.',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
