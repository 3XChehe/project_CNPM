"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TVTT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TVTT.belongsTo(models.HoKhau, { foreignKey: "HoKhauId" });
    }
  }
  TVTT.init(
    {
      TVTTId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      LoaiGiay: DataTypes.ENUM("TAM_VANG", "TAM_TRU"),
      HoTen: DataTypes.STRING,
      GioiTinh: DataTypes.BOOLEAN,
      NgaySinh: DataTypes.DATE,
      CCCD: DataTypes.STRING,
      SoHoKhau: DataTypes.STRING,
      LyDo: DataTypes.STRING,
      NgayBatDau: DataTypes.DATE,
      NgayKetThuc: DataTypes.DATE,
      HoKhauId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TVTT",
      createdAt: "NgayTao",
      updatedAt: "NgayCapNhat",
      id: false,
      freezeTableName: true,
    }
  );
  return TVTT;
};
