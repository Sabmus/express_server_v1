const mongoose = require("mongoose");
const validator = require("validator");
const { hashPassword } = require("../utils/hash");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is a required field."],
  },
  email: {
    type: String,
    required: [true, "email is a required field."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "must enter a valid email."],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "password is a required field."],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "confirm password is a required field."],
    validate: {
      // this validate will work only with save() and create()
      validator: function (val) {
        return val === this.password;
      },
      message: "password doesn't match.",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // encrypt password before save it
  this.password = await hashPassword(this.password);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
