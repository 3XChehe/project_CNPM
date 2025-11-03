"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TVTT", {
      TVTTId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      LoaiGiay: {
        type: Sequelize.ENUM("TAM_VANG", "TAM_TRU"),
      },
      HoTen: {
        type: Sequelize.STRING,
      },
      GioiTinh: {
        type: Sequelize.BOOLEAN,
      },
      NgaySinh: {
        type: Sequelize.DATE,
      },
      CCCD: {
        type: Sequelize.STRING,
      },
      SoHoKhau: {
        type: Sequelize.STRING,
      },
      LyDo: {
        type: Sequelize.STRING,
      },
      NgayBatDau: {
        type: Sequelize.DATE,
      },
      NgayKetThuc: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("TVTT");
  },
};
