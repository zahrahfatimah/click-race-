"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Score, {
        foreignKey: "UserId",
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          arg: true,
          msg: 'Username must be unique'
        },
        validate: {
          notEmpty: { msg: `Username can't be empty` },
          notNull: { msg: `Username can't be empty` },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
