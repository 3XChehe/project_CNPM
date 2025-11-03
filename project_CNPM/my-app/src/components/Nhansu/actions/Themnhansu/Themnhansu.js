import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./Themnhansu.scss";

const Themnhansu = (props) => {
  const { show, onHide, fetchUsers } = props;
  const [formData, setFormData] = useState({
    taikhoan: "",
    matkhau: "",
    xacnhanmatkhau: "",
    chucvu: "",
  });
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu khớp
    if (formData.matkhau !== formData.xacnhanmatkhau) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Kiểm tra các trường bắt buộc
    if (!formData.taikhoan || !formData.matkhau || !formData.chucvu) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    let dangky = {
      TaiKhoan: formData.taikhoan,
      MatKhau: formData.matkhau,
      ChucVu: formData.chucvu,
    };

    // Call API
    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dangky),
      });
      const data = await res.json();
      if (data.EC === 0) {
        alert("Thêm nhân sự thành công!");
        // Reset form
        setFormData({
          taikhoan: "",
          matkhau: "",
          xacnhanmatkhau: "",
          chucvu: "",
        });
        // Refresh danh sách nhân sự
        if (fetchUsers) {
          fetchUsers();
        }
        // Đóng modal
        onHide();
      } else {
        alert(data.EM);
      }
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Có lỗi xảy ra khi thêm nhân sự!");
    }
  };

  const handleClose = () => {
    // Reset form khi đóng modal
    setFormData({
      taikhoan: "",
      matkhau: "",
      xacnhanmatkhau: "",
      chucvu: "",
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#667eea" }}>
        <Modal.Title
          style={{
            color: "#ffffff",
          }}
        >
          Thêm Nhân Sự Mới
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="themnhansu-wrapper">
          <form onSubmit={handleSubmit} className="themnhansu-form">
            <div className="form-group">
              <label htmlFor="taikhoan">Tài khoản</label>
              <input
                type="text"
                id="taikhoan"
                name="taikhoan"
                value={formData.taikhoan}
                onChange={handleChange}
                placeholder="Nhập tài khoản"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="matkhau">Mật khẩu</label>
                <input
                  type="password"
                  id="matkhau"
                  name="matkhau"
                  value={formData.matkhau}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="xacnhanmatkhau">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  id="xacnhanmatkhau"
                  name="xacnhanmatkhau"
                  value={formData.xacnhanmatkhau}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="chucvu">Chức vụ</label>
              <select
                id="chucvu"
                name="chucvu"
                value={formData.chucvu}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn chức vụ --</option>
                <option value="TT">TT</option>
                <option value="TP">TP</option>
                <option value="CB_PAKN">CB_PAKN</option>
                <option value="CB_HKNK">CB_HKNK</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleClose}
              >
                Hủy
              </button>
              <button type="submit" className="btn-submit">
                Thêm Nhân Sự
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Themnhansu;
