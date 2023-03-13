const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchTry = require("../utils/catchTry");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOption.secure = true;

  res.cookie("token", token, cookieOption);

  res.status(statusCode).json({ status: "success", token, data: user });
};

exports.signup = catchTry(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    picture,
    location,
    occupation,
  } = req.body;

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    picture,
    location,
    occupation,
    viewedProfile: Math.floor(Math.random() * 1000),
    impressions: Math.floor(Math.random() * 1000),
  });
  newUser.password = undefined;
  createSendToken(newUser, 201, res);
});
