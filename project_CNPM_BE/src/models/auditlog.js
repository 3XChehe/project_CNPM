"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AuditLog.belongsTo(models.User, { foreignKey: "UserId" });
      AuditLog.belongsTo(models.NhanKhau, { foreignKey: "NhanKhauId" });
      AuditLog.belongsTo(models.HoKhau, { foreignKey: "HoKhauId" });
    }
  }
  AuditLog.init(
    {
      LogId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      LogType: DataTypes.ENUM("TRANG_THAI_NHAN_KHAU", "CHU_HO_CUA_HO_KHAU"),
      NoiDung: DataTypes.STRING,
      ThoiGian: DataTypes.DATE,
      UserId: DataTypes.STRING,
      NhanKhauId: DataTypes.STRING,
      HoKhauId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AuditLog",
      createdAt: "NgayTao",
      updatedAt: "NgayCapNhat",
      id: false,
    }
  );
  return AuditLog;
};
