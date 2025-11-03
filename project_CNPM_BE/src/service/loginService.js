import bcrypt from "bcryptjs";
import db, { Sequelize } from "../models/index.js";
import { where } from "sequelize";
// import { getUserinfoByAccount } from "./JWTServices.js";
import { CreateJWT } from "../middleware/JWTActions.js";

import crypto from "crypto";
import { access } from "fs";

const generateId = () => crypto.randomBytes(16).toString("hex");
const HashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const CheckUserTK = async (taikhoan) => {
  const check_taikhoan = await db.User.findOne({
    where: { TaiKhoan: taikhoan },
  });
  if (check_taikhoan === null) {
    return false;
  } else {
    return true;
  }
};

const HandleRegister = async (data) => {
  try {
    let hash_pass = await HashPassword(data.MatKhau);
    const check_taikhoan = await CheckUserTK(data.TaiKhoan);
    const id = generateId();

    if (check_taikhoan) {
      return {
        EM: "Tài khoản đã được đăng ký",
        EC: 1,
        DT: "",
      };
    } else {
      await db.User.create({
        UserId: id,
        TaiKhoan: data.TaiKhoan,
        ChucVu: data.ChucVu,
        MatKhau: hash_pass,
      });
      return {
        EM: "Đăng ký thành công",
        EC: 0,
      };
    }
  } catch (error) {
    console.log("Error in HandleRegister: ", error);
    return {
      EM: error,
      EC: -2,
    };
  }
};

const HandleLogin = async (data) => {
  try {
    const user = await db.User.findOne({
      where: { TaiKhoan: data.TaiKhoan },
      attributes: ["TaiKhoan", "MatKhau", "ChucVu", "UserId"],
    });
    if (!user) {
      return {
        EM: "Tài khoản không tồn tại",
        EC: 1,
      };
    }
    let user_pass = user.MatKhau;
    const check_pass = await bcrypt.compare(data.MatKhau, user_pass);
    if (!check_pass) {
      return {
        EM: "Mật khẩu không đúng",
        EC: 2,
      };
    }

    if (check_pass) {
      let payload = {
        TaiKhoan: user.TaiKhoan,
        ChucVu: user.ChucVu,
        UserId: user.UserId,
      };
      let token = CreateJWT(payload);

      return {
        EM: "Đăng nhập thành công",
        EC: 0,
        DT: {
          access_token: token,
          TaiKhoan: user.TaiKhoan,
          ChucVu: user.ChucVu,
          UserId: user.UserId,
        },
      };
    }
  } catch (err) {
    console.log("Error in HandleLogin: ", err);
    return {
      EM: "ERROR" + " " + err,
      EC: -2,
    };
  }
};

export { HandleRegister, HandleLogin, HashPassword };
