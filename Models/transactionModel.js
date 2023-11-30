const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dbConn');
const User = require('./userModel');
const Account = require('./accountModel');
const Category = require('./categoryModel');

class Transaction extends Model {}
Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    hasInstalment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    instalmentQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    instalmentAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
  },
  {
    sequelize,
    paranoid: true,
  }
);

// associations
User.hasMany(Transaction, {
  foreignKey: {
    allowNull: false,
  },
});
Transaction.belongsTo(User);

Account.hasMany(Transaction);
Transaction.belongsTo(Account, {
  foreignKey: {
    allowNull: false,
  },
});

Category.hasMany(Transaction);
Transaction.belongsTo(Category, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = Transaction;
