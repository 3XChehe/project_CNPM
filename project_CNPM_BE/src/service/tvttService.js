import db, { Sequelize } from "../models/index.js";
import { HashPassword } from "./loginService.js";
import crypto from "crypto";

const generateId = () => crypto.randomBytes(16).toString("hex");

const CaculatePageSize = (total_page, total_items) => {
  let page_size = Math.ceil(total_items / total_page);
  return page_size;
};

const TVTTShowPaginationService = async (page, limit) => {
  try {
    const total_items = await db.TVTT.count();

    // Xử lý trường hợp không có dữ liệu
    if (total_items === 0) {
      return {
        EM: "Get data successfully",
        EC: 0,
        DT: {
          rows: [],
          total_page: 0,
          current_page: page,
        },
      };
    }

    const total_page = Math.ceil(total_items / limit);
    const page_size = CaculatePageSize(total_page, total_items);
    const offset = (page - 1) * page_size;

    const { count, rows } = await db.TVTT.findAndCountAll({
      attributes: [
        "TVTTId",
        "LoaiGiay",
        "HoTen",
        "GioiTinh",
        "NgaySinh",
        "CCCD",
        "LyDo",
        "NgayBatDau",
        "NgayKetThuc",
        "SoHoKhau",
      ],
      limit: page_size,
      offset: offset,
    });
    return {
      EM: "Get data successfully",
      EC: 0,
      DT: {
        rows: rows,
        total_page: total_page,
        current_page: page,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      EM: err,
      EC: -2,
      DT: "",
    };
  }
};

const TVTTSearchService = async (q, page = 1, limit = 10) => {
  try {
    const SimilarString = {
      "tam vang": "TAM_VANG",
      "tam tru": "TAM_TRU",
      "tạm vắng": "TAM_VANG",
      "tạm trú": "TAM_TRU",
    };
    // Normalize query để tìm trạng thái
    const normalizedQ = q.toLowerCase().trim();
    const matchedTrangThai = SimilarString[normalizedQ];
    const whereClause = {
      [Sequelize.Op.or]: [
        { HoTen: { [Sequelize.Op.like]: `%${q}%` } },
        { GioiTinh: { [Sequelize.Op.like]: `%${q}%` } },
        { NgaySinh: { [Sequelize.Op.like]: `%${q}%` } },
        { CCCD: { [Sequelize.Op.like]: `%${q}%` } },
        { LyDo: { [Sequelize.Op.like]: `%${q}%` } },
        { NgayBatDau: { [Sequelize.Op.like]: `%${q}%` } },
        { NgayKetThuc: { [Sequelize.Op.like]: `%${q}%` } },
        ...(matchedTrangThai
          ? [{ LoaiGiay: matchedTrangThai }]
          : [{ LoaiGiay: { [Sequelize.Op.like]: `%${q}%` } }]),
      ],
    };

    const offset = (Math.max(Number(page), 1) - 1) * Number(limit);

    const { count, rows } = await db.TVTT.findAndCountAll({
      where: whereClause,
      attributes: [
        "TVTTId",
        "LoaiGiay",
        "HoTen",
        "GioiTinh",
        "NgaySinh",
        "CCCD",
        "LyDo",
        "NgayBatDau",
        "NgayKetThuc",
        "SoHoKhau",
      ],
      limit: Number(limit),
      offset: offset,
    });

    const total_page = count > 0 ? Math.ceil(count / Number(limit)) : 0;

    return {
      EM: "Get data successfully",
      EC: 0,
      DT: {
        results: rows,
        total: count,
        total_page: total_page,
        current_page: Number(page),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      EM: err.message || err,
      EC: -2,
      DT: "",
    };
  }
};

const TVTTCreateService = async (data) => {
  try {
    const CCCD = data.CCCD;
    const SoHoKhau = data.SoHoKhau;
    // co ton tai nhan khau va nhan khau co ton tai ho khau
    const person = await db.NhanKhau.findOne({
      where: { CCCD: CCCD, SoHoKhau: SoHoKhau },
    });
    if (!person) {
      return {
        EM: "Có vấn đề với nhân khẩu hoặc hộ khẩu, vui lòng kiểm tra lại",
        EC: 1,
        DT: "",
      };
    }
    // co ton tai ho khau
    const hoKhau = await db.HoKhau.findOne({
      where: { SoHoKhau: SoHoKhau },
    });
    if (!hoKhau) {
      return {
        EM: "Số hộ khẩu không tồn tại trong hệ thống",
        EC: 1,
        DT: "",
      };
    }
    // tao giay to
    const newTVTT = await db.TVTT.create({
      TVTTId: generateId(),
      HoKhauId: hoKhau.HoKhauId,
      GioiTinh: data.GioiTinh === "Nam" ? true : false,
      ...data,
    });
    return {
      EM: "Tạo giấy tạm vắng thành công",
      EC: 0,
      DT: "",
    };
  } catch (err) {
    console.log(err);
    return {
      EM: err.message || err,
      EC: -2,
      DT: "",
    };
  }
};

export { TVTTShowPaginationService, TVTTSearchService, TVTTCreateService };
