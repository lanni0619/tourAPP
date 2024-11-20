const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, 'A user name should more or equal then 3 characters.'],
    maxlength: [50, 'A user name should less or equal then 50 characters.'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email format is not correct.'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: 'role is either: user, guide or lead-guide',
    },
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Passowrd should more or equal then 8 characters'],
    select: false,
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
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// ==================== middleware
// hash password
userSchema.pre('save', async function (next) {
  // Only run bcrypt if password is modify
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12.
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Updating password changed time
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

// Filtering out inactive account
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// ==================== instance
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtIssuedAt) {
  if (this.passwordChangedAt) {
    // Date.prototype.getTime() return numbers of milliseconds
    // parseInt function - parses a string argument and returns an integer of the specified radix
    // radix = decimal
    const changedTimeAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return changedTimeAt > jwtIssuedAt;
  }
  // False means not changes
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // send it back to user's email
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
