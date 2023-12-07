const { Model } = require('sequelize');
const { hashPassword, checkPassword } = require('../utils/hash');
const fkRules = require('./shared/foreignKeyRules');
const crypto = require('crypto');
//const validator = require("validator");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async validatePassword(password) {
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
      const resetToken = crypto.randomBytes(32).toString('hex');
      return resetToken;
    }

    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: {
          name: 'role',
          allowNull: false,
          defaultValue: 1,
        },
      });
      this.hasMany(models.Account, fkRules.notNull);
      this.hasMany(models.Category, fkRules.notNull);
      this.hasMany(models.Transaction, fkRules.notNull);
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      lastName: DataTypes.STRING,
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
        beforeCreate: async user => {
          user.password = await hashPassword(user.password);
        },
        beforeUpdate: async user => {
          if (user.changed('password')) {
            user.password = await hashPassword(user.password);
            user.passwordChangedAt = Date.now();
            user.passwordResetToken = null;
            user.passwordResetTokenExpires = null;
          }
        },
      },
      sequelize,
      //paranoid: true,
    }
  );
  return User;
};
