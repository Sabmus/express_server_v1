const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/dbConn");
const { hashPassword, checkPassword } = require("../utils/hash");
//const validator = require("validator");
//const crypto = require("crypto");

const adminRole = "admin";
const userRole = "user";

class User extends Model {
  async validatePassword(password) {
    return await checkPassword(password, this.password);
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
    },
    sequelize,
    modelName: "User",
  }
);

module.exports = User;
