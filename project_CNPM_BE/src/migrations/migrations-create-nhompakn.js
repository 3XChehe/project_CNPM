"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("NhomPAKN", {
      NhomPAKNId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      SoLuong: {
        type: Sequelize.INTEGER,
      },
      TrangThai: {
        type: Sequelize.ENUM("CHUA_GIAI_QUYET", "DA_GIAI_QUYET"),
      },
      NoiDungChinh: {
        type: Sequelize.STRING,
      },
      TenNhom: {
        type: Sequelize.STRING,
      },
      NgayTao: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      NgayCapNhat: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("NhomPAKN");
  },
};
