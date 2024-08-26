const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Use in UpdateMe
const filterObj = (reqBodyObj, ...allowedFields) => {
  const newObj = {};
  Object.keys(reqBodyObj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = reqBodyObj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Send error if user POSTs password or passwordConfirm
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'UpdateMe error: Please use /users/updatePassword route to update password',
        400,
      ),
    );

  // 2) Filtered out unwanted fields
  const filterBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  // put updatedUser at "res.locals" then pug template could access.
  res.locals.user = updatedUser;

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not define. Please use /signup instead',
  });
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// Don't update password with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
