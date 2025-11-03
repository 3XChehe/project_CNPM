"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NhanKhau extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // mqh giữa nhân khẩu và hộ khẩu
      NhanKhau.belongsTo(models.HoKhau, {
        foreignKey: "HoKhauId",
        as: "hokhau",
      });
      // mqh giữa nhân khẩu và chủ hộ khẩu
      NhanKhau.hasOne(models.ChuHoKhau, {
        foreignKey: "NhanKhauId",
      });
      NhanKhau.hasMany(models.AuditLog, { foreignKey: "NhanKhauId" });
    }
  }
  NhanKhau.init(
    {
      NhanKhauId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      DiaChiCu: DataTypes.STRING,
      SoHoKhau: DataTypes.STRING,
      BiDanh: DataTypes.STRING,
      HoTen: DataTypes.STRING,
      GioiTinh: DataTypes.BOOLEAN,
      GhiChu: DataTypes.STRING,
      QuanHeVoiChuHo: DataTypes.STRING,
      CCCD: DataTypes.STRING,
      TrangThai: DataTypes.ENUM("O_HO_KHAU", "DA_QUA_DOI", "CHUYEN_HO_KHAU"),
      NgaySinh: DataTypes.DATE,
      HoKhauId: DataTypes.STRING,
      //new

      NoiSinh: DataTypes.STRING,
      NguyenQuan: DataTypes.STRING,
      DanToc: DataTypes.STRING,
      NgheNghiep: DataTypes.STRING,
      NoiLamViec: DataTypes.STRING,
      NgayCapCCCD: DataTypes.DATE,
      NoiCapCCCD: DataTypes.STRING,
      NgayDangKyThuongTru: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "NhanKhau",
      createdAt: "NgayTao",
      updatedAt: "NgayCapNhat",
      id: false,
      freezeTableName: true,
    }
  );
  return NhanKhau;
};
