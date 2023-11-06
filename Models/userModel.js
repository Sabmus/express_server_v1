const mongoose = require('mongoose');
const validator = require('validator');

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
  password: {
    type: String,
    required: [true, 'password is a required field.'],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'confirm password is a required field.'],
    validate: {
      // this validate will work only with save() and create()
      validator: function (val) {
        return val === this.password;
      },
      message: "password doesn't match.",
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
