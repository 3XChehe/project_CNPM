"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      UserId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      ChucVu: {
        type: Sequelize.ENUM("TT", "TP", "CB_HKNK", "CB_PAKN"),
      },
      TaiKhoan: {
        type: Sequelize.STRING,
      },
      MatKhau: {
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
    await queryInterface.dropTable("Users");
  },
};
