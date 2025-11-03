"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChuHoKhau extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //mqh giữa chủ hộ khẩu và nhân khẩu
      ChuHoKhau.belongsTo(models.NhanKhau, { foreignKey: "NhanKhauId" });
      ChuHoKhau.belongsTo(models.HoKhau, { foreignKey: "HoKhauId" });
    }
  }
  ChuHoKhau.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      HoKhauId: DataTypes.STRING,
      NhanKhauId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ChuHoKhau",
      createdAt: "NgayTao",
      updatedAt: "NgayCapNhat",
      id: false,
      freezeTableName: true,
    }
  );
  return ChuHoKhau;
};
