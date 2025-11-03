"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AuditLogs", {
      LogId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      LogType: {
        type: Sequelize.ENUM("TRANG_THAI_NHAN_KHAU", "CHU_HO_CUA_HO_KHAU"),
      },
      NoiDung: {
        type: Sequelize.STRING,
      },
      ThoiGian: {
        type: Sequelize.DATE,
      },
      UserId: {
        type: Sequelize.STRING,
      },
      NhanKhauId: {
        type: Sequelize.STRING,
      },
      HoKhauId: {
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
    await queryInterface.dropTable("AuditLogs");
  },
};
