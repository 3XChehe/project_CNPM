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
      // define association here
      User.hasMany(models.AuditLog, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      UserId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      ChucVu: DataTypes.ENUM("TT", "TP", "CB_HKNK", "CB_PAKN"),
      TaiKhoan: DataTypes.STRING,
      MatKhau: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      createdAt: "NgayTao",
      updatedAt: "NgayCapNhat",
      id: false,
    }
  );
  return User;
};
