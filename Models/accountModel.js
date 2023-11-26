const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dbConn');

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
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        min: 1,
        max: 31,
      },
    },
  },
  {
    sequelize,
    paranoid: true,
  }
);

module.exports = Account;
