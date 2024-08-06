// Packages
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
// Models
const User = require('../models/userModel');
// Functions
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES * 24 * 60 * 60 * 1000,
    ),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

  res.cookie('jwt', token, cookiesOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // Security flaw
  // const newUser = await User.create(req.body);
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });
  newUser.password = undefined;
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email & password is exist
  if (!email || !password)
    return next(new AppError('Please provide email or password!', 400));

  // 2) check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    // 401 stand for un-authorized
    return next(new AppError('Incorrect email or passowrd!', 401));
  }
  // 3) If everything ok, send token to client
  user.password = undefined;
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting JWT and check of it's there.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Please login first!', 401));
  }

  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belongs to this token does no longer exist.', 401),
    );

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed the password. Please login again!',
        401,
      ),
    );
  }
  // Grant access to protected routes
  req.user = currentUser;
  next();
});

// roles = ['admin','lead-guide' ...] we can extend it.
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // if user's role = user
    if (!roles.includes(req.user.role)) {
      return next(
        // 403 stand for forbidden
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

// Password Reset Functionality
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User From Poseted Email
  const { email } = req.body;

  const user = await User.findOne(email);

  if (!user) return next(new AppError('The user is not exist!', 404));

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 3) Send email to user
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to :${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. Set the new password only if the token has not expired and there is user
  if (!user)
    return next(new AppError('Token is invalid or has expired.😢', 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3. Update the changePasswordAt properties for the user (pre-save-hook)

  // 4. Login the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection

  const user = await User.findById(req.user._id).select('+password');
  const { checkPassword, newPassword, newPasswordConfirm } = req.body;

  // 2) Check if POSTed current password is correct

  if (!(await user.correctPassword(checkPassword, user.password)))
    return next(
      new AppError('updatePassword error: Incorrect current password!', 401),
    );

  // 3) If so, update the password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  // 4) log user in, send JWT
  createSendToken(user, 200, res);
});
