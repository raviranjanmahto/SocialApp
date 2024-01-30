const AppError = require("../../../Natours/utils/appError");
const User = require("../models/userModel");
const catchTry = require("../utils/catchAsync");

exports.getUser = catchTry(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new AppError(`No user found with id: ${req.params.id}`));
  res.status(200).json({ status: "success", data: user });
});

exports.getUserFriends = catchTry(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new AppError(`No user found with id: ${req.params.id}`));
  const friends = await Promise.all(user.friends.map(id => User.findById(id)));
  res.status(200).json({ status: "success", data: friends });
});

exports.addRemoveFriend = catchTry(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const friend = await User.findById(req.params.friendId);
  if (!user)
    return next(new AppError(`No user found with id: ${req.params.id}`));
  if (user.friends.include(req.params.friendId)) {
    user.friends = user.friends.filter(id => id !== req.params.friendId);
    friend.friends = friend.friends.filter(id => id !== req.params.id);
  } else {
    user.friends.push(req.params.friendId);
    friend.friends.push(req.params.id);
  }
  await user.save();
  await friend.save();
  res.status(200).json({ status: "success", data: user });
});
