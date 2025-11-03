import db, { Sequelize } from "../models/index.js";
import crypto from "crypto";
const CaculatePageSize = (total_page, total_items) => {
  let page_size = Math.ceil(total_items / total_page);
  return page_size;
};
const generateId = () => crypto.randomBytes(16).toString("hex");
// lấy ra danh sách hộ khẩu có phân trang
const HoKhauShowPaginationService = async (page, limit) => {
  try {
    const total_items = await db.HoKhau.count();
    const total_page = Math.ceil(total_items / limit);
    const page_size = CaculatePageSize(total_page, total_items);
    const offset = (page - 1) * page_size;

    const { count, rows } = await db.HoKhau.findAndCountAll({
      attributes: [
        "HoKhauId",
        "SoNha",
        "DuongPho",
        "Phuong",
        "Quan",
        "SoHoKhau",
        "NgayLap",
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

// tìm kiếm HoKhau theo nhiều trường (search as you type)
const HoKhauSearchService = async (q, page = 1, limit = 20) => {
  console.log("search query in service:", q, "page:", page, "limit:", limit);
  try {
    // if (!q || q.toString().trim() === "") {
    //   return {
    //     EM: "Empty query",
    //     EC: 1,
    //     DT: { results: [], total: 0, total_page: 0, current_page: 1 },
    //   };
    // }

    const whereClause = {
      [Sequelize.Op.or]: [
        { HoKhauId: { [Sequelize.Op.like]: `%${q}%` } },
        { SoNha: { [Sequelize.Op.like]: `%${q}%` } },
        { DuongPho: { [Sequelize.Op.like]: `%${q}%` } },
        { Phuong: { [Sequelize.Op.like]: `%${q}%` } },
        { Quan: { [Sequelize.Op.like]: `%${q}%` } },
        { SoHoKhau: { [Sequelize.Op.like]: `%${q}%` } },
      ],
    };

    const offset = (Math.max(Number(page), 1) - 1) * Number(limit);

    const { count, rows } = await db.HoKhau.findAndCountAll({
      where: whereClause,
      attributes: [
        "HoKhauId",
        "SoNha",
        "DuongPho",
        "Phuong",
        "Quan",
        "SoHoKhau",
        "NgayLap",
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

const HoKhauCreateService = async (data, UserId) => {
  try {
    const hoKhau = data.hoKhau;
    const chuHo = data.chuHo.data;
    const ngayChuyen = data.chuHo.ngayDoi;
    const noiDung = data.chuHo.noiDung;
    // kiểm tra xem số hộ khẩu đã tồn tại chưa
    const existingHoKhau = await db.HoKhau.findOne({
      where: { SoHoKhau: hoKhau.soHoKhau },
    });
    if (existingHoKhau) {
      return {
        EM: "Số hộ khẩu đã tồn tại",
        EC: 1,
      };
    }
    // kiểm tra xem chủ hộ có tồn tại trong bảng NhanKhau (theo CCCD)
    const person = await db.NhanKhau.findOne({
      where: { CCCD: chuHo.soCMND || chuHo.CCCD },
    });

    // nếu đã có record NhanKhau, kiểm tra họ có đang là 'chủ hộ' của bất kỳ HoKhau nào không
    if (person) {
      const existingChuHo = await db.ChuHoKhau.findOne({
        where: { NhanKhauId: person.NhanKhauId },
      });
      if (existingChuHo) {
        return {
          EM: "Người này hiện đang là chủ hộ (không thể làm chủ hộ cho hộ khác)",
          EC: 1,
          DT: "",
        };
      }
      //tạo mới HoKhau; ChuHoKhau và cập nhật NhanKhau trong transaction
      const id_hk = generateId();
      const res_hk = await db.HoKhau.create({
        HoKhauId: id_hk,
        SoNha: hoKhau.soNha,
        DuongPho: hoKhau.duongPho,
        Phuong: hoKhau.phuong,
        Quan: hoKhau.quan,
        SoHoKhau: hoKhau.soHoKhau,
        // ngày lập để hôm nay dạng Date
        NgayLap: new Date(),
      });
      if (res_hk) {
        const HoKhauId = res_hk.HoKhauId;
        const NhanKhauId = person.NhanKhauId;
        // update các trường trong bảng nhân khẩu
        person.SoHoKhau = res_hk.SoHoKhau;
        person.QuanHeVoiChuHo = "Chủ hộ";
        person.TrangThai = "O_HO_KHAU";
        person.HoKhauId = HoKhauId;
        await person.save();

        // tạo chủ hộ
        const res_chuho = await db.ChuHoKhau.create({
          HoKhauId: HoKhauId,
          NhanKhauId: NhanKhauId,
        });
        if (res_chuho) {
          // viết log
          await db.AuditLog.create({
            LogId: generateId(),
            LogType: "CHU_HO_CUA_HO_KHAU",
            NoiDung: noiDung,
            ThoiGian: ngayChuyen,
            UserId: UserId,
            HoKhauId: HoKhauId,
            NhanKhauId: NhanKhauId,
          });
          return {
            EM: "Tạo hộ khẩu và chủ hộ thành công",
            EC: 0,
            DT: "",
          };
        } else {
          return {
            EM: "Tạo hộ khẩu và chủ hộ thất bại",
            EC: 1,
            DT: "",
          };
        }
      }
    }
    // nếu không thì tạo mới HoKhau và ChuHoKhau và cả NhanKhau trong transaction
    const id_hk = generateId();
    const res_hk = await db.HoKhau.create({
      HoKhauId: id_hk,
      SoNha: hoKhau.soNha,
      DuongPho: hoKhau.duongPho,
      Phuong: hoKhau.phuong,
      Quan: hoKhau.quan,
      SoHoKhau: hoKhau.soHoKhau,
      // ngày lập để hôm nay dạng Date
      NgayLap: new Date(),
    });
    if (res_hk) {
      const HoKhauId = res_hk.HoKhauId;
      // tạo nhân khẩu cho chủ hộ nếu chưa có
      const NhanKhauId = generateId();
      const res_nk = await db.NhanKhau.create({
        NhanKhauId: NhanKhauId,
        SoHoKhau: hoKhau.soHoKhau,
        HoTen: chuHo.hoTen,
        GioiTinh: chuHo.gioiTinh,
        QuanHeVoiChuHo: "Chủ hộ",
        CCCD: chuHo.soCMND,
        TrangThai: "O_HO_KHAU",
        NgaySinh: chuHo.ngaySinh,
        HoKhauId: HoKhauId,
      });
      // tạo chủ hộ
      if (res_nk) {
        const res_chuho = await db.ChuHoKhau.create({
          HoKhauId: HoKhauId,
          NhanKhauId: NhanKhauId,
        });
        if (res_chuho) {
          return {
            EM: "Tạo hộ khẩu và chủ hộ thành công",
            EC: 0,
            DT: "",
          };
        } else {
          return {
            EM: "Tạo hộ khẩu và chủ hộ thất bại",
            EC: 1,
            DT: "",
          };
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const HoKhauViewDetailNKService = async (HoKhauId) => {
  try {
    const hoKhau = await db.HoKhau.findOne({
      where: { HoKhauId },
      include: [
        {
          model: db.NhanKhau,
          as: "nhankhau",
        },
        {
          model: db.ChuHoKhau,
          include: [
            {
              model: db.NhanKhau,
            },
          ],
        },
      ],
    });
    if (hoKhau) {
      return {
        EM: "Lấy thông tin hộ khẩu thành công",
        EC: 0,
        DT: hoKhau,
      };
    } else {
      return {
        EM: "Hộ khẩu không tồn tại",
        EC: 1,
        DT: "",
      };
    }
  } catch (err) {
    console.log(err);
  }
};

const HoKhauSearchLimitedService = async (q) => {
  try {
    const whereClause = {
      [Sequelize.Op.or]: [{ SoHoKhau: { [Sequelize.Op.like]: `%${q}%` } }],
    };
    const res = await db.HoKhau.findAll({
      where: whereClause,
      attributes: ["SoHoKhau", "SoNha", "DuongPho", "Phuong", "Quan"],
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
  }
};

export {
  HoKhauShowPaginationService,
  HoKhauSearchService,
  HoKhauCreateService,
  HoKhauViewDetailNKService,
  HoKhauSearchLimitedService,
};
