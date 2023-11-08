const User = require("../Models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const { checkPassword } = require("../utils/hash");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password are present in the body of request
  if (!email || !password) {
    const error = new CustomError(400, "email and passworod must be provided");
    return next(error);
  }

  //check if user exists in db
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new CustomError(400, "invalid email or password");
    return next(error);
  }

  //check if password is correct
  const correctPassword = await checkPassword(password, user.password);

  if (!correctPassword) {
    const error = new CustomError(400, "invalid email or password");
    return next(error);
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
});

module.exports = {
  signup,
  login,
};
