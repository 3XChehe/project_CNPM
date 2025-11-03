import db, { Sequelize } from "../models/index.js";
import crypto from "crypto";
const CaculatePageSize = (total_page, total_items) => {
  let page_size = Math.ceil(total_items / total_page);
  return page_size;
};
const generateId = () => crypto.randomBytes(16).toString("hex");
// lấy ra danh sách nhân khẩu có trạng thái là "CHUYEN_HO_KHAU"
const NhanKhauShowChuyenHoKhauService = async (q) => {
  try {
    const whereClause = {
      [Sequelize.Op.or]: [
        { HoTen: { [Sequelize.Op.like]: `%${q}%` } },
        { CCCD: { [Sequelize.Op.like]: `%${q}%` } },
      ],
    };
    const res = await db.NhanKhau.findAll({
      where: whereClause,
      attributes: ["NhanKhauId", "CCCD", "HoTen", "NgaySinh"],
      limit: 5,
    });
    return {
      EM: "Get data successfully",
      EC: 0,
      DT: {
        users: res,
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

const NhanKhauShowPaginationService = async (page, limit) => {
  try {
    const total_items = await db.NhanKhau.count();
    const total_page = Math.ceil(total_items / limit);
    const page_size = CaculatePageSize(total_page, total_items);
    const offset = (page - 1) * page_size;

    const { count, rows } = await db.NhanKhau.findAndCountAll({
      attributes: [
        "NhanKhauId",
        "HoTen",
        "BiDanh",
        "GioiTinh",
        "NgaySinh",
        "NoiSinh",
        "NguyenQuan",
        "DanToc",
        "NgheNghiep",
        "NoiLamViec",
        "CCCD",
        "NgayCapCCCD",
        "NoiCapCCCD",
        "NgayDangKyThuongTru",
        "DiaChiCu",
        "TrangThai",
        "SoHoKhau",
        "QuanHeVoiChuHo",
        "GhiChu",
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

const NhanKhauSearchService = async (q, page = 1, limit = 20) => {
  try {
    // Mapping text -> DB value cho trạng thái
    const trangThaiMapping = {
      "ở hộ khẩu": "O_HO_KHAU",
      "o ho khau": "O_HO_KHAU",
      "đã qua đời": "DA_QUA_DOI",
      "da qua doi": "DA_QUA_DOI",
      "chuyển hộ khẩu": "CHUYEN_HO_KHAU",
      "chuyen ho khau": "CHUYEN_HO_KHAU",
    };

    // Normalize query để tìm trạng thái
    const normalizedQ = q.toLowerCase().trim();
    const matchedTrangThai = trangThaiMapping[normalizedQ];

    const whereClause = {
      [Sequelize.Op.or]: [
        { HoTen: { [Sequelize.Op.like]: `%${q}%` } },
        { BiDanh: { [Sequelize.Op.like]: `%${q}%` } },
        { GioiTinh: { [Sequelize.Op.like]: `%${q}%` } },
        { NgaySinh: { [Sequelize.Op.like]: `%${q}%` } },
        { NguyenQuan: { [Sequelize.Op.like]: `%${q}%` } },
        { DanToc: { [Sequelize.Op.like]: `%${q}%` } },
        { NgheNghiep: { [Sequelize.Op.like]: `%${q}%` } },
        { NoiLamViec: { [Sequelize.Op.like]: `%${q}%` } },
        { CCCD: { [Sequelize.Op.like]: `%${q}%` } },
        { GhiChu: { [Sequelize.Op.like]: `%${q}%` } },
        { SoHoKhau: { [Sequelize.Op.like]: `%${q}%` } },
        // Nếu tìm thấy mapping, search cả text lẫn DB value
        ...(matchedTrangThai
          ? [{ TrangThai: matchedTrangThai }]
          : [{ TrangThai: { [Sequelize.Op.like]: `%${q}%` } }]),
      ],
    };

    const offset = (Math.max(Number(page), 1) - 1) * Number(limit);

    const { count, rows } = await db.NhanKhau.findAndCountAll({
      where: whereClause,
      attributes: [
        "NhanKhauId",
        "HoTen",
        "BiDanh",
        "GioiTinh",
        "NgaySinh",
        "NoiSinh",
        "NguyenQuan",
        "DanToc",
        "NgheNghiep",
        "NoiLamViec",
        "CCCD",
        "NgayCapCCCD",
        "NoiCapCCCD",
        "NgayDangKyThuongTru",
        "DiaChiCu",
        "TrangThai",
        "SoHoKhau",
        "QuanHeVoiChuHo",
        "GhiChu",
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

const NhanKhauCreateService = async (data) => {
  try {
    const NhanKhauId = generateId();
    const CCCD = data.CCCD;
    const SoHoKhau = data.SoHoKhau;
    const QuanHeVoiChuHo = data.QuanHeVoiChuHo;
    const TrangThai = data.TrangThai;

    // kiem tra cccd da ton tai chua
    const existingNhanKhau = await db.NhanKhau.findOne({
      where: { CCCD: CCCD },
    });
    if (existingNhanKhau) {
      return {
        EM: "CCCD đã tồn tại",
        EC: 1,
        DT: "",
      };
    }
    if (TrangThai === "O_HO_KHAU") {
      // kiem tra so ho khau co ton tai khong
      const existingHoKhau = await db.HoKhau.findOne({
        where: { SoHoKhau: SoHoKhau },
      });
      if (!existingHoKhau) {
        return {
          EM: "Sổ hộ khẩu không tồn tại",
          EC: 1,
          DT: "",
        };
      }
      if (
        QuanHeVoiChuHo.toLowerCase() === "chủ hộ" ||
        QuanHeVoiChuHo.toLowerCase() === "chu ho"
      ) {
        // kiem tra xem da co chu ho trong ho khau chua
        const existingChuHo = await db.ChuHoKhau.findOne({
          where: { HoKhauId: existingHoKhau.HoKhauId },
        });
        if (existingChuHo) {
          return {
            EM: "Hộ khẩu đã có chủ hộ",
            EC: 1,
            DT: "",
          };
        }
        const create = await db.NhanKhau.create({
          NhanKhauId: NhanKhauId,
          HoKhauId: existingHoKhau.HoKhauId,
          ...data,
        });
        if (create) {
          // tao chu ho
          const createChuHo = await db.ChuHoKhau.create({
            HoKhauId: existingHoKhau.HoKhauId,
            NhanKhauId: NhanKhauId,
          });
          if (createChuHo) {
            return {
              EM: "Tạo nhân khẩu và chủ hộ thành công",
              EC: 0,
              DT: create,
            };
          }
        }
      }
      const create = await db.NhanKhau.create({
        NhanKhauId: NhanKhauId,
        HoKhauId: existingHoKhau.HoKhauId,
        ...data,
      });
      if (create) {
        return {
          EM: "Tạo nhân khẩu thành công",
          EC: 0,
          DT: create,
        };
      }
    } else {
      const create = await db.NhanKhau.create({
        NhanKhauId: NhanKhauId,
        ...data,
      });
      if (create) {
        return {
          EM: "Tạo nhân khẩu thành công",
          EC: 0,
          DT: create,
        };
      }
    }
  } catch (err) {
    console.log(err);
    return {
      EM: err.message || err,
      EC: -2,
      DT: "",
    };
  }
};

const NhanKhauChangeTrangThaiChuyenOrQuaDoiService = async (data, UserId) => {
  try {
    const NhanKhauId = data.NhanKhauId;
    // kiem tra nhan khau co ton tai khong
    const existingNhanKhau = await db.NhanKhau.findOne({
      where: { NhanKhauId: NhanKhauId },
    });
    if (!existingNhanKhau) {
      return {
        EM: "Nhân khẩu không tồn tại",
        EC: 1,
        DT: "",
      };
    }
    // lay du lieu ho khau cua nhan khau
    const hoKhau = await db.HoKhau.findOne({
      where: { HoKhauId: existingNhanKhau.HoKhauId },
    });
    if (!hoKhau) {
      return {
        EM: "Nhân khẩu không có hộ khẩu",
        EC: 1,
        DT: "",
      };
    }
    // cap nhat trang thai nhan khau
    const DiaChiCu =
      hoKhau.SoNha +
      ", " +
      hoKhau.DuongPho +
      ", " +
      hoKhau.Phuong +
      ", " +
      hoKhau.Quan;
    existingNhanKhau.TrangThai = data.LoaiThayDoi;
    existingNhanKhau.DiaChiCu = DiaChiCu;
    existingNhanKhau.SoHoKhau = null;
    existingNhanKhau.QuanHeVoiChuHo = null;
    existingNhanKhau.HoKhauId = null;
    await existingNhanKhau.save();

    // nếu nhân khẩu là chủ hộ thì xóa chủ hộ
    const chuHo = await db.ChuHoKhau.findOne({
      where: { NhanKhauId: NhanKhauId, HoKhauId: hoKhau.HoKhauId },
    });
    if (chuHo) {
      await db.ChuHoKhau.destroy({
        where: { NhanKhauId: NhanKhauId, HoKhauId: hoKhau.HoKhauId },
      });
    }
    // viết log thay doi nhan khau
    await db.AuditLog.create({
      LogId: generateId(),
      LogType: "TRANG_THAI_NHAN_KHAU",
      NoiDung: data.GhiChu,
      ThoiGian: data.NgayChuyenDi,
      UserId: UserId,
      NhanKhauId: NhanKhauId,
      HoKhauId: hoKhau.HoKhauId,
    });

    return {
      EM: "Cập nhật trạng thái nhân khẩu thành công",
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

const NhanKhauAddToHoKhauService = async (data, UserId) => {
  try {
    const NhanKhauId = data.NhanKhauId;
    const SoHoKhau = data.SoHoKhau;
    const QuanHeVoiChuHo = data.QuanHeVoiChuHo;
    // kiem tra nhan khau co ton tai khong
    const person = await db.NhanKhau.findOne({
      where: { NhanKhauId: NhanKhauId },
    });
    if (!person) {
      return {
        EM: "Nhân khẩu không tồn tại",
        EC: 1,
        DT: "",
      };
    }
    // kiem tra so ho khau co ton tai khong
    const hoKhau = await db.HoKhau.findOne({
      where: { SoHoKhau: SoHoKhau },
    });
    if (!hoKhau) {
      return {
        EM: "Hộ khẩu không tồn tại",
        EC: 1,
        DT: "",
      };
    }
    // nếu quan hệ với chủ hộ là chủ hộ thì kiểm tra hộ khẩu đã có chủ hộ chưa
    if (
      QuanHeVoiChuHo.trim().toLowerCase() === "chủ hộ" ||
      QuanHeVoiChuHo.trim().toLowerCase() === "chu ho"
    ) {
      const existingChuHo = await db.ChuHoKhau.findOne({
        where: { HoKhauId: hoKhau.HoKhauId },
      });
      if (existingChuHo) {
        return {
          EM: "Hộ khẩu đã có chủ hộ",
          EC: 1,
          DT: "",
        };
      }
      // tạo chủ hộ
      await db.ChuHoKhau.create({
        HoKhauId: hoKhau.HoKhauId,
        NhanKhauId: NhanKhauId,
      });
      // viết log thêm nhân khẩu vào hộ khẩu (chủ hộ)
      await db.AuditLog.create({
        LogId: generateId(),
        LogType: "CHU_HO_CUA_HO_KHAU",
        NoiDung: `Thêm nhân khẩu vào hộ khẩu ${SoHoKhau} với quan hệ ${QuanHeVoiChuHo}`,
        ThoiGian: new Date(),
        UserId: UserId,
        NhanKhauId: NhanKhauId,
        HoKhauId: hoKhau.HoKhauId,
      });
    }
    // cập nhật nhân khẩu vào hộ khẩu
    person.HoKhauId = hoKhau.HoKhauId;
    person.SoHoKhau = hoKhau.SoHoKhau;
    person.QuanHeVoiChuHo = QuanHeVoiChuHo;
    person.TrangThai = "O_HO_KHAU";
    await person.save();
    // viết log thêm nhân khẩu vào hộ khẩu (khác)
    await db.AuditLog.create({
      LogId: generateId(),
      LogType: "TRANG_THAI_NHAN_KHAU",
      NoiDung: `Thêm nhân khẩu vào hộ khẩu ${SoHoKhau} với quan hệ ${QuanHeVoiChuHo}`,
      ThoiGian: new Date(),
      UserId: UserId,
      NhanKhauId: NhanKhauId,
      HoKhauId: hoKhau.HoKhauId,
    });
    return {
      EM: "Thêm nhân khẩu vào hộ khẩu thành công",
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

export {
  NhanKhauShowChuyenHoKhauService,
  NhanKhauShowPaginationService,
  NhanKhauSearchService,
  NhanKhauCreateService,
  NhanKhauChangeTrangThaiChuyenOrQuaDoiService,
  NhanKhauAddToHoKhauService,
};
