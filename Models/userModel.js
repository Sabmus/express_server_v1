const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/dbConn");
const { hashPassword, checkPassword } = require("../utils/hash");
const crypto = require("crypto");
//const validator = require("validator");

const adminRole = "admin";
const userRole = "user";

class User extends Model {
  async validatePassword(password) {
    console.log(password, this.password);
    return await checkPassword(password, this.password);
  }

  isPasswordChanged(iat) {
    return this.passwordChangedAt > iat;
  }

  createResetPasswordToken() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    return resetToken;
  }
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
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    passwordResetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await hashPassword(user.password);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await hashPassword(user.password);
          user.passwordChangedAt = Date.now();
          user.passwordResetToken = null;
          user.passwordResetTokenExpires = null;
        }
      },
    },
    sequelize,
    modelName: "User",
  }
);

module.exports = User;
