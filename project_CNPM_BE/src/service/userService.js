import db, { Sequelize } from "../models/index.js";
import { HashPassword } from "./loginService.js";
const CaculatePageSize = (total_page, total_items) => {
  let page_size = Math.ceil(total_items / total_page);
  return page_size;
};

const UserShowPaginationService = async (page, limit) => {
  try {
    const total_items = await db.User.count();

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

    const { count, rows } = await db.User.findAndCountAll({
      attributes: ["UserId", "ChucVu", "TaiKhoan"],
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

// tìm kiếm người dùng theo tài khoản (search as you type)
const UserSearchByAccountService = async (account) => {
  console.log("account in service:", account);
  try {
    const users = await db.User.findAll({
      where: {
        TaiKhoan: {
          [Sequelize.Op.like]: `%${account}%`,
        },
      },
      attributes: ["UserId", "ChucVu", "TaiKhoan"],
      limit: 20,
    });

    return {
      EM: "Get data successfully",
      EC: 0,
      DT: {
        users: users,
        total: users.length,
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

// Xoá account user
const UserDeleteAccountService = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { UserId: userId },
    });
    if (!user) {
      return {
        EM: "User not found",
        EC: -1,
        DT: "",
      };
    }
    await db.User.destroy({
      where: { UserId: userId },
    });
    return {
      EM: "Xoá tài khoản thành công",
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

// đổi mật khẩu user
const UserChangePasswordService = async (userId, newPassword) => {
  try {
    const user = await db.User.findOne({
      where: { UserId: userId },
    });
    if (!user) {
      return {
        EM: "User not found",
        EC: -1,
        DT: "",
      };
    }
    let hash_pass = await HashPassword(newPassword);
    user.MatKhau = hash_pass;
    await user.save();
    return {
      EM: "Đổi mật khẩu thành công",
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
  UserShowPaginationService,
  UserSearchByAccountService,
  UserDeleteAccountService,
  UserChangePasswordService,
};
