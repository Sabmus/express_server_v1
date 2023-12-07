const { Model } = require('sequelize');
const fkRules = require('./shared/foreignKeyRules');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      this.belongsTo(models.User);
      this.belongsTo(models.Account, fkRules.notNull);
      this.belongsTo(models.Category, fkRules.notNull);
    }
  }
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
  return Transaction;
};
