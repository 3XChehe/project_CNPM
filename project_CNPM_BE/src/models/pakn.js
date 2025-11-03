"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PAKN extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PAKN.belongsTo(models.NhomPAKN, { foreignKey: "NhomPAKNId" });
    }
  }
  PAKN.init(
    {
      PAKNId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      CCCD: DataTypes.STRING,
      NguoiPA: DataTypes.STRING,
      NgayPhanAnh: DataTypes.DATE,
      NoiDung: DataTypes.STRING,
      Email: DataTypes.STRING,
      Sdt: DataTypes.STRING,
      NhomPAKNId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PAKN",
      createdAt: "NgayTao",
      updatedAt: "NgayCapNhat",
      id: false,
      freezeTableName: true,
    }
  );
  return PAKN;
};
