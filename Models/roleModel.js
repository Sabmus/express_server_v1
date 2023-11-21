const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dbConn');

class Role extends Model {}
Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  {
    sequelize,
  }
);

module.exports = Role;
