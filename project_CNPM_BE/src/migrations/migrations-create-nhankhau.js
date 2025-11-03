"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("NhanKhau", {
      NhanKhauId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      DiaChiCu: {
        type: Sequelize.STRING,
      },
      SoHoKhau: {
        type: Sequelize.STRING,
      },
      BiDanh: {
        type: Sequelize.STRING,
      },
      HoTen: {
        type: Sequelize.STRING,
      },
      GioiTinh: {
        type: Sequelize.BOOLEAN,
      },
      GhiChu: {
        type: Sequelize.STRING,
      },
      QuanHeVoiChuHo: {
        type: Sequelize.STRING,
      },
      CCCD: {
        type: Sequelize.STRING,
      },
      TrangThai: {
        type: Sequelize.ENUM("O_HO_KHAU", "DA_QUA_DOI", "CHUYEN_HO_KHAU"),
      },
      NgaySinh: {
        type: Sequelize.DATE,
      },
      HoKhauId: {
        type: Sequelize.STRING,
      },
      NoiSinh: {
        type: Sequelize.STRING,
      },
      NguyenQuan: {
        type: Sequelize.STRING,
      },
      DanToc: {
        type: Sequelize.STRING,
      },
      NgheNghiep: {
        type: Sequelize.STRING,
      },
      NoiLamViec: {
        type: Sequelize.STRING,
      },
      NgayCapCCCD: {
        type: Sequelize.DATE,
      },
      NoiCapCCCD: {
        type: Sequelize.STRING,
      },
      NgayDangKyThuongTru: {
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
    await queryInterface.dropTable("NhanKhau");
  },
};
