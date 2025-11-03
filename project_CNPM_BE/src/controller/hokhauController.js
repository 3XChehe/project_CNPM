import {
  HoKhauShowPaginationService,
  HoKhauSearchService,
  HoKhauCreateService,
  HoKhauViewDetailNKService,
  HoKhauSearchLimitedService,
} from "../service/hokhauService.js";

const HoKhauShowPaginationController = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    console.log("req.user:", req.user);
    const res_show = await HoKhauShowPaginationService(page, limit);
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

const HoKhauSearchController = async (req, res) => {
  try {
    let q = req.query.q || "";
    // parse pagination params and provide sensible defaults
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;
    // cap limit to avoid too large responses
    limit = Math.min(limit, 100);

    const res_search = await HoKhauSearchService(q, page, limit);
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

const HoKhauCreateController = async (req, res) => {
  try {
    const userId = req.user.UserId;
    const data = req.body;
    const res_create = await HoKhauCreateService(data, userId);
    if (res_create) {
      return res.status(200).json({
        EM: res_create.EM,
        EC: res_create.EC,
        DT: res_create.DT,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      EM: "ERROR" + " " + err,
      EC: -1,
      DT: "",
    });
  }
};

const HoKhauViewDetailNKController = async (req, res) => {
  try {
    const HoKhauId = req.params.HoKhauId;
    const res_view = await HoKhauViewDetailNKService(HoKhauId);
    if (res_view) {
      return res.status(200).json({
        EM: res_view.EM,
        EC: res_view.EC,
        DT: res_view.DT,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      EM: "ERROR" + " " + err,
      EC: -1,
      DT: "",
    });
  }
};

const HoKhauSearchLimitedController = async (req, res) => {
  try {
    let q = req.query.q;
    const res_search = await HoKhauSearchLimitedService(q);
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

export {
  HoKhauShowPaginationController,
  HoKhauSearchController,
  HoKhauCreateController,
  HoKhauViewDetailNKController,
  HoKhauSearchLimitedController,
};
