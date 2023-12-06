const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dbConn');
const Role = require('./roleModel');
const Category = require('./categoryModel');
const Account = require('./accountModel');
const { hashPassword, checkPassword } = require('../utils/hash');
const crypto = require('crypto');
//const validator = require("validator");

// associations
const associationOptions = {
  foreignKey: {
    name: 'role',
    allowNull: false,
    defaultValue: 1,
  },
};

const UserSchema = () => {
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

    static associate() {
      Role.hasMany(User, associationOptions);
      User.belongsTo(Role, associationOptions);

      User.hasMany(Account, {
        foreignKey: {
          allowNull: false,
        },
      });
      Account.belongsTo(User);

      User.hasMany(Category, {
        foreignKey: {
          allowNull: false,
        },
      });
      Category.belongsTo(User);
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
      paranoid: true,
    }
  );
  return User;
};

// exports
module.exports = UserSchema;
