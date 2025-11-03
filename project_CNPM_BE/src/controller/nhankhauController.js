import {
  NhanKhauShowPaginationService,
  NhanKhauSearchService,
  NhanKhauCreateService,
  NhanKhauChangeTrangThaiChuyenOrQuaDoiService,
  NhanKhauAddToHoKhauService,
  NhanKhauShowChuyenHoKhauService,
} from "../service/nhankhauService.js";

const NhanKhauShowChuyenHoKhauController = async (req, res) => {
  try {
    let q = req.query.q;
    const res_search = await NhanKhauShowChuyenHoKhauService(q);
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

const NhanKhauShowPaginationController = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    console.log("req.user:", req.user);
    const res_show = await NhanKhauShowPaginationService(page, limit);
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

const NhanKhauSearchController = async (req, res) => {
  try {
    let q = req.query.q || "";
    // parse pagination params and provide sensible defaults
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;
    // cap limit to avoid too large responses
    limit = Math.min(limit, 100);

    const res_search = await NhanKhauSearchService(q, page, limit);
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

const NhanKhauCreateController = async (req, res) => {
  try {
    let nhankhauData = req.body;
    const res_create = await NhanKhauCreateService(nhankhauData);
    if (res_create) {
      return res.status(200).json({
        EM: res_create.EM,
        EC: res_create.EC,
        DT: res_create.DT,
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

const NhanKhauChangeTrangThaiChuyenOrQuaDoiController = async (req, res) => {
  try {
    let data = req.body;
    console.log("req.user:", req.user);
    const userId = req.user.UserId;
    const res_change = await NhanKhauChangeTrangThaiChuyenOrQuaDoiService(
      data,
      userId
    );
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

const NhanKhauAddToHoKhauController = async (req, res) => {
  try {
    let data = req.body;
    const userId = req.user.UserId;
    const res_add = await NhanKhauAddToHoKhauService(data, userId);
    if (res_add) {
      return res.status(200).json({
        EM: res_add.EM,
        EC: res_add.EC,
        DT: res_add.DT,
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
  NhanKhauShowChuyenHoKhauController,
  NhanKhauShowPaginationController,
  NhanKhauSearchController,
  NhanKhauCreateController,
  NhanKhauChangeTrangThaiChuyenOrQuaDoiController,
  NhanKhauAddToHoKhauController,
};
