import {
  UserShowPaginationService,
  UserSearchByAccountService,
  UserChangePasswordService,
  UserDeleteAccountService,
} from "../service/userService.js";

const UserShowPaginationController = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    console.log("req.user:", req.user);
    const res_show = await UserShowPaginationService(page, limit);
    if (res_show) {
      return res.status(200).json({
        EM: res_show.EM,
        EC: res_show.EC,
        DT: res_show.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "ERROR" + " " + e,
      EC: -1,
      DT: "",
    });
  }
};

const UserSearchByAccountController = async (req, res) => {
  try {
    let account = req.query.account;
    const res_search = await UserSearchByAccountService(account);
    if (res_search) {
      return res.status(200).json({
        EM: res_search.EM,
        EC: res_search.EC,
        DT: res_search.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "ERROR" + " " + e,
      EC: -1,
      DT: "",
    });
  }
};

const UserDeleteAccountController = async (req, res) => {
  try {
    const userId = req.params.id;
    const res_delete = await UserDeleteAccountService(userId);
    if (res_delete) {
      return res.status(200).json({
        EM: res_delete.EM,
        EC: res_delete.EC,
        DT: res_delete.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "ERROR" + " " + e,
      EC: -1,
      DT: "",
    });
  }
};

const UserChangePasswordController = async (req, res) => {
  try {
    const userId = req.body.UserId;
    const newPassword = req.body.newPassword;
    const res_change = await UserChangePasswordService(userId, newPassword);
    if (res_change) {
      return res.status(200).json({
        EM: res_change.EM,
        EC: res_change.EC,
        DT: res_change.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "ERROR" + " " + e,
      EC: -1,
      DT: "",
    });
  }
};

export {
  UserShowPaginationController,
  UserSearchByAccountController,
  UserChangePasswordController,
  UserDeleteAccountController,
};
