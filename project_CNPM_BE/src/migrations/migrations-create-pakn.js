"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PAKN", {
      PAKNId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      CCCD: {
        type: Sequelize.STRING,
      },
      NguoiPA: {
        type: Sequelize.STRING,
      },
      NgayPhanAnh: {
        type: Sequelize.DATE,
      },
      NoiDung: {
        type: Sequelize.STRING,
      },
      Email: {
        type: Sequelize.STRING,
      },
      Sdt: {
        type: Sequelize.STRING,
      },
      NhomPAKNId: {
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
    await queryInterface.dropTable("PAKN");
  },
};
