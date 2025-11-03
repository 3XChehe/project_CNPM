import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nhankhau from "./components/Nhankhau/Nhankhau";
import Hokhau from "./components/Hokhau/Hokhau";
import HomePage from "./components/Home/HomePage";
import Phananh from "./components/Phananh/Phananh";
import Dangnhap from "./components/Dangnhap/Dangnhap";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import TTRoute from "./components/ProtectedRoute/TTRoute";
import HKAndNKRoute from "./components/ProtectedRoute/HKAndNKRoute";
import Nhansu from "./components/Nhansu/Nhansu";
import TVTT from "./components/TVTT/TVTT";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="dangnhap" element={<Dangnhap />} />

          {/* Protected Routes - Cần đăng nhập */}
          <Route
            path="hokhau"
            element={
              <HKAndNKRoute>
                <Hokhau />
              </HKAndNKRoute>
            }
          />
          <Route
            path="nhankhau"
            element={
              <HKAndNKRoute>
                <Nhankhau />
              </HKAndNKRoute>
            }
          />
          <Route
            path="phananh"
            element={
              <ProtectedRoute>
                <Phananh />
              </ProtectedRoute>
            }
          />
          <Route
            path="tvtt"
            element={
              <HKAndNKRoute>
                <TVTT />
              </HKAndNKRoute>
            }
          />
          <Route
            path="nhansu"
            element={
              <TTRoute>
                <Nhansu />
              </TTRoute>
            }
          />
        </Route>
      </Routes>

      {/* <App /> */}
    </BrowserRouter>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
