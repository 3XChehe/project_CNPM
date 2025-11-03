import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dangnhap.scss";

const Dangnhap = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    TaiKhoan: "",
    MatKhau: "",
  });
  const apiUrl = process.env.REACT_APP_API_URL;

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!formData.TaiKhoan || !formData.MatKhau) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // call api
    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.EC === 0) {
        // Lưu thông tin user vào localStorage
        if (data.DT) {
          localStorage.setItem("user", JSON.stringify(data.DT));
          window.dispatchEvent(new Event("userChanged"));
        }

        // Reset form
        setFormData({
          TaiKhoan: "",
          MatKhau: "",
        });

        alert("Đăng nhập thành công!");
        // Chuyển hướng sang trang hộ khẩu
        navigate("/hokhau");
      } else {
        alert(data.EM);
      }
    } catch (err) {
      console.error("Login error:", err);
    }

    // console.log("Login data:", formData);
    // alert("Đăng nhập thành công!");

    // Reset form sau khi đăng nhập
    setFormData({
      TaiKhoan: "",
      MatKhau: "",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="dangnhap-container">
      <div className="dangnhap-wrapper">
        <h2 className="dangnhap-title">Đăng Nhập</h2>
        <p className="dangnhap-subtitle">Chào mừng bạn trở lại!</p>

        <form onSubmit={handleSubmit} className="dangnhap-form">
          <div className="form-group">
            <label htmlFor="TaiKhoan">Tài khoản</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="TaiKhoan"
                name="TaiKhoan"
                value={formData.TaiKhoan}
                onChange={handleChange}
                placeholder="Nhập tài khoản"
                required
              />
              <span className="input-icon">👤</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="MatKhau">Mật khẩu</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="MatKhau"
                name="MatKhau"
                value={formData.MatKhau}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
              <span
                className="input-icon password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️" : "🔒"}
              </span>
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dangnhap;
