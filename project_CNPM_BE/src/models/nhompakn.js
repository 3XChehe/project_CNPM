"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NhomPAKN extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NhomPAKN.hasMany(models.PAKN, { foreignKey: "NhomPAKNId" });
    }
  }
  NhomPAKN.init(
    {
      NhomPAKNId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      SoLuong: DataTypes.INTEGER,
      TrangThai: DataTypes.ENUM("CHUA_GIAI_QUYET", "DA_GIAI_QUYET"),
      NoiDungChinh: DataTypes.STRING,
      TenNhom: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "NhomPAKN",
      createdAt: "NgayTao",
      updatedAt: "NgayCapNhat",
      id: false,
      freezeTableName: true,
    }
  );
  return NhomPAKN;
};
