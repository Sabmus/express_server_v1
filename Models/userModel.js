const mongoose = require('mongoose');
const validator = require('validator');
const { hashPassword } = require('../utils/hash');
const crypto = require('crypto');

const adminRole = 'admin';
const userRole = 'user';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is a required field.'],
  },
  email: {
    type: String,
    required: [true, 'email is a required field.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'must enter a valid email.'],
  },
  photo: String,
  role: {
    type: String,
    enum: [userRole, adminRole],
    default: userRole,
  },
  password: {
    type: String,
    required: [true, 'password is a required field.'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'confirm password is a required field.'],
    select: false,
    validate: {
      // this validate will work only with save() and create()
      validator: function (val) {
        return val === this.password;
      },
      message: "password doesn't match.",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

userSchema.pre('save', async function (next) {
  // check if password was changed
  if (!this.isModified('password')) {
    return next();
  }

  // encrypt password before save it
  this.password = await hashPassword(this.password);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < passwordChangedTimestamp;
  }

  return false;
};

userSchema.methods.isAdmin = function () {
  return this.role === adminRole;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // now plus 10 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
