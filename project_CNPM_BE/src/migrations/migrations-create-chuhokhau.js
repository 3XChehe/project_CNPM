"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ChuHoKhau", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      HoKhauId: {
        type: Sequelize.STRING,
      },
      NhanKhauId: {
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
    await queryInterface.dropTable("ChuHoKhau");
  },
};
