"use strict";
const { Model } = require("sequelize");
const nhankhau = require("./nhankhau");
module.exports = (sequelize, DataTypes) => {
  class HoKhau extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // mqh giữa hộ khẩu và nhân khẩu
      HoKhau.hasMany(models.NhanKhau, {
        foreignKey: "HoKhauId",
        as: "nhankhau",
      });
      // mqh giữa hộ khẩu và chủ hộ khẩu
      HoKhau.hasOne(models.ChuHoKhau, {
        foreignKey: "HoKhauId",
      });
      HoKhau.hasMany(models.AuditLog, { foreignKey: "HoKhauId" });
      HoKhau.hasMany(models.TVTT, { foreignKey: "HoKhauId" });
    }
  }
  HoKhau.init(
    {
      HoKhauId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      SoNha: DataTypes.STRING,
      DuongPho: DataTypes.STRING,
      Phuong: DataTypes.STRING,
      Quan: DataTypes.STRING,
      SoHoKhau: DataTypes.STRING,
      NgayLap: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "HoKhau",
      createdAt: "NgayTao",
      updatedAt: "NgayCapNhat",
      id: false,
      freezeTableName: true,
    }
  );
  return HoKhau;
};
