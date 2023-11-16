const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/dbConn");
const { hashPassword, checkPassword } = require("../utils/hash");
//const validator = require("validator");
//const crypto = require("crypto");

const adminRole = "admin";
const userRole = "user";

class User extends Model {
  async validatePassword(password) {
    console.log(password, this.password);
    return await checkPassword(password, this.password);
  }

  isPasswordChanged() {}
}
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
      validate: {
        notEmpty: true,
      },
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    hooks: {
      beforeCreate: async (user) => {
        user.password = await hashPassword(user.password);
      },
      beforeUpdate: (user) => {
        console.log(user);
        if (user.password) {
          user.passwordChangedAt = DataTypes.NOW;
        }
      },
    },
    sequelize,
    modelName: "User",
  }
);

module.exports = User;
