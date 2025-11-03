import { HandleRegister, HandleLogin } from "../service/loginService";

const RegisterAPI = async (req, res) => {
  try {
    let data = req.body;
    console.log("data RegisterAPI:", data);
    if (!data.ChucVu || !data.TaiKhoan || !data.MatKhau) {
      return res.status(400).json({
        EM: "Missing required parameters",
        EC: -1,
        DT: "",
      });
    } else {
      const res_register = await HandleRegister(data);
      return res.status(200).json({
        EM: res_register.EM,
        EC: res_register.EC,
        DT: "",
      });
    }
  } catch (err) {
    console.log("Error in RegisterAPI: ", err);
    return res.status(500).json({
      EM: "ERROR" + " " + err,
      EC: -1,
      DT: "",
    });
  }
};

const LoginAPI = async (req, res) => {
  try {
    let data = req.body;
    console.log("data LoginAPI:", data);
    if (!data.TaiKhoan || !data.MatKhau) {
      return res.status(400).json({
        EM: "Missing required parameters",
        EC: -1,
        DT: "",
      });
    } else {
      const res_login = await HandleLogin(data);
      // Lưu token trong cookie httpOnly
      res.cookie("token", res_login?.DT?.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        EM: res_login.EM,
        EC: res_login.EC,
        DT: res_login.DT,
      });
    }
  } catch (err) {
    console.log("Error in LoginAPI: ", err);
    return res.status(500).json({
      EM: "ERROR" + " " + err,
      EC: -1,
      DT: "",
    });
  }
};

const getProfile = (req, res) => {
  return res.status(200).json({
    EM: "Success",
    EC: 0,
    DT: {
      user: req.user,
    },
  });
};
const Logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    EM: "đăng xuất thành công",
    EC: 0,
    DT: "",
  });
};

export { RegisterAPI, LoginAPI, getProfile, Logout };
