import {
  TVTTShowPaginationService,
  TVTTSearchService,
  TVTTCreateService,
} from "../service/tvttService.js";

const TVTTShowPaginationController = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    console.log("pager:", page, "limit:", limit);
    const res_show = await TVTTShowPaginationService(page, limit);
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

const TVTTSearchByAccountController = async (req, res) => {
  try {
    let q = req.query.q;
    const res_search = await TVTTSearchService(q);
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

const TVTTCreateController = async (req, res) => {
  try {
    const data = req.body;
    console.log("req.user:", req.user);
    const res_create = await TVTTCreateService(data);
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
      EM: "ERROR" + " " + e,
      EC: -1,
      DT: "",
    });
  }
};

export {
  TVTTShowPaginationController,
  TVTTSearchByAccountController,
  TVTTCreateController,
};
