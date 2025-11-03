"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HoKhau", {
      HoKhauId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      SoNha: {
        type: Sequelize.STRING,
      },
      DuongPho: {
        type: Sequelize.STRING,
      },
      Phuong: {
        type: Sequelize.STRING,
      },
      Quan: {
        type: Sequelize.STRING,
      },
      SoHoKhau: {
        type: Sequelize.STRING,
      },
      NgayLap: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("HoKhau");
  },
};
