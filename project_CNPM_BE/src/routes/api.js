import express from "express";
import {
  UserShowPaginationController,
  UserSearchByAccountController,
  UserDeleteAccountController,
  UserChangePasswordController,
} from "../controller/userController";
import {
  LoginAPI,
  RegisterAPI,
  Logout,
  getProfile,
} from "../controller/loginController";
import {
  HoKhauShowPaginationController,
  HoKhauSearchController,
  HoKhauCreateController,
  HoKhauViewDetailNKController,
  HoKhauSearchLimitedController,
} from "../controller/hokhauController";

import {
  NhanKhauShowChuyenHoKhauController,
  NhanKhauShowPaginationController,
  NhanKhauSearchController,
  NhanKhauCreateController,
  NhanKhauChangeTrangThaiChuyenOrQuaDoiController,
  NhanKhauAddToHoKhauController,
} from "../controller/nhankhauController.js";

import {
  TVTTShowPaginationController,
  TVTTSearchByAccountController,
  TVTTCreateController,
} from "../controller/tvttController";

import { JWTcheckUser } from "../middleware/JWTActions";

const router = express.Router();

const initAPIRoutes = (app) => {
  // route login
  router.post("/register", RegisterAPI);
  router.post("/login", LoginAPI);
  router.use(JWTcheckUser);

  router.get("/auth/profile", getProfile);
  router.post("/logout", Logout);

  // route user
  router.get("/user/pagination", UserShowPaginationController);
  router.get("/user/search", UserSearchByAccountController);
  router.delete("/user/delete/:id", UserDeleteAccountController);
  router.patch("/user/change-password", UserChangePasswordController);

  // route hokhau
  router.get("/hokhau/pagination", HoKhauShowPaginationController);
  router.get("/hokhau/search", HoKhauSearchController);
  router.post("/hokhau/create", HoKhauCreateController);
  router.get("/hokhau/detail-nk/:HoKhauId", HoKhauViewDetailNKController);
  router.get("/hokhau/search-limited", HoKhauSearchLimitedController);

  // route nhankhau
  router.get("/nhankhau/pagination", NhanKhauShowPaginationController);
  router.get("/nhankhau/search", NhanKhauShowChuyenHoKhauController);
  router.get("/nhankhau/search-detail", NhanKhauSearchController);
  router.post("/nhankhau/create", NhanKhauCreateController);
  router.patch(
    "/nhankhau/change-trangthai",
    NhanKhauChangeTrangThaiChuyenOrQuaDoiController
  );
  router.post("/nhankhau/add-to-hokhau", NhanKhauAddToHoKhauController);

  // route tvtt
  router.get("/tvtt/pagination", TVTTShowPaginationController);
  router.get("/tvtt/search", TVTTSearchByAccountController);
  router.post("/tvtt/create", TVTTCreateController);

  return app.use("/api/v1", router);
};
export default initAPIRoutes;
