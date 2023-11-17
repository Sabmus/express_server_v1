const { DataTypes, Model, Deferrable } = require("sequelize");
const sequelize = require("../utils/dbConn");
const Role = require("./roleModel");
const { hashPassword, checkPassword } = require("../utils/hash");
const crypto = require("crypto");
//const validator = require("validator");

//const adminRole = "admin";
//const userRole = "user";

class User extends Model {
  async validatePassword(password) {
    console.log(password, this.password);
    return await checkPassword(password, this.password);
  }

  isPasswordChanged(jwtIAT) {
    if (this.passwordChangedAt) {
      const passwordChangedAtMs = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return passwordChangedAtMs > jwtIAT;
    }
    return false;
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
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: "id",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
      defaultValue: 1,
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
  }
);

// associations
//User.belongsTo(Role, {foreignKey});
//Role.hasMany(User);

// exports
module.exports = User;
