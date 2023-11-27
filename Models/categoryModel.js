const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dbConn');

class Category extends Model {}
Category.init(
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
  },
  {
    sequelize,
    paranoid: true,
  }
);

module.exports = Category;
