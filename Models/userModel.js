const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/dbConn");
const validator = require("validator");
const { hashPassword } = require("../utils/hash");
const crypto = require("crypto");

const adminRole = "admin";
const userRole = "user";

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      values: [adminRole, userRole],
      defaultValue: userRole,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

module.exports = User;
