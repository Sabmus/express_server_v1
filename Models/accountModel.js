const { Model } = require('sequelize');

const accountType = ['Debit', 'Credit', 'Cash'];

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      this.belongsTo(models.User);
      this.hasMany(models.Transaction);
    }
  }
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
  return Account;
};
