const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dbConn');
const User = require('./userModel');

const accountType = ['Debit', 'Credit', 'Cash'];

class Account extends Model {}
Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: accountType,
      allowNull: false,
    },
    billingPeriod: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
  }
);

// associations
User.hasMany(Account);
Account.belongsTo(User, {
  primaryKey: {
    allowNull: false,
  },
});

module.exports = Account;
