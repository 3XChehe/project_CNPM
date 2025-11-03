import { useState, useEffect } from "react";
import "./AddGiay.scss";

const AddGiay = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    LoaiGiay: "",
    HoTen: "",
    CCCD: "",
    NgaySinh: "",
    GioiTinh: "",
    SoHoKhau: "",
    LyDo: "",
    NgayBatDau: "",
    NgayKetThuc: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        LoaiGiay: "",
        HoTen: "",
        CCCD: "",
        NgaySinh: "",
        GioiTinh: "",
        SoHoKhau: "",
        LyDo: "",
        NgayBatDau: "",
        NgayKetThuc: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.LoaiGiay) {
      newErrors.LoaiGiay = "Loại giấy tờ là bắt buộc";
    }

    if (!formData.HoTen.trim()) {
      newErrors.HoTen = "Họ và tên là bắt buộc";
    }

    if (!formData.NgaySinh) {
      newErrors.NgaySinh = "Ngày sinh là bắt buộc";
    }

    if (!formData.GioiTinh) {
      newErrors.GioiTinh = "Giới tính là bắt buộc";
    }

    if (!formData.SoHoKhau.trim()) {
      newErrors.SoHoKhau = "Số hộ khẩu là bắt buộc";
    }

    if (!formData.LyDo.trim()) {
      newErrors.LyDo = "Lý do là bắt buộc";
    }

    if (!formData.NgayBatDau) {
      newErrors.NgayBatDau = "Ngày bắt đầu là bắt buộc";
    }

    if (!formData.NgayKetThuc) {
      newErrors.NgayKetThuc = "Ngày kết thúc là bắt buộc";
    }

    // Validate date range
    if (formData.NgayBatDau && formData.NgayKetThuc) {
      const startDate = new Date(formData.NgayBatDau);
      const endDate = new Date(formData.NgayKetThuc);
      if (endDate <= startDate) {
        newErrors.NgayKetThuc = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm giấy tạm vắng - tạm trú</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>
                  Loại giấy tờ <span className="required">*</span>
                </label>
                <select
                  name="LoaiGiay"
                  value={formData.LoaiGiay}
                  onChange={handleChange}
                  className={errors.LoaiGiay ? "error" : ""}
                >
                  <option value="">-- Chọn loại giấy tờ --</option>
                  <option value="TAM_VANG">Tạm vắng</option>
                  <option value="TAM_TRU">Tạm trú</option>
                </select>
                {errors.LoaiGiay && (
                  <span className="error-message">{errors.LoaiGiay}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Họ & tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="HoTen"
                  value={formData.HoTen}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  className={errors.HoTen ? "error" : ""}
                />
                {errors.HoTen && (
                  <span className="error-message">{errors.HoTen}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CMND/CCCD</label>
                <input
                  type="text"
                  name="CCCD"
                  value={formData.CCCD}
                  onChange={handleChange}
                  placeholder="Nhập số CMND/CCCD"
                  maxLength="12"
                />
              </div>

              <div className="form-group">
                <label>
                  Ngày sinh <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="NgaySinh"
                  value={formData.NgaySinh}
                  onChange={handleChange}
                  className={errors.NgaySinh ? "error" : ""}
                />
                {errors.NgaySinh && (
                  <span className="error-message">{errors.NgaySinh}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Giới tính <span className="required">*</span>
                </label>
                <select
                  name="GioiTinh"
                  value={formData.GioiTinh}
                  onChange={handleChange}
                  className={errors.GioiTinh ? "error" : ""}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                {errors.GioiTinh && (
                  <span className="error-message">{errors.GioiTinh}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Số hộ khẩu <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="SoHoKhau"
                  value={formData.SoHoKhau}
                  onChange={handleChange}
                  placeholder="Nhập số hộ khẩu"
                  className={errors.SoHoKhau ? "error" : ""}
                />
                {errors.SoHoKhau && (
                  <span className="error-message">{errors.SoHoKhau}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>
                  Lý do <span className="required">*</span>
                </label>
                <textarea
                  name="LyDo"
                  value={formData.LyDo}
                  onChange={handleChange}
                  placeholder="Nhập lý do tạm vắng/tạm trú"
                  rows="3"
                  className={errors.LyDo ? "error" : ""}
                />
                {errors.LyDo && (
                  <span className="error-message">{errors.LyDo}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Ngày bắt đầu <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="NgayBatDau"
                  value={formData.NgayBatDau}
                  onChange={handleChange}
                  className={errors.NgayBatDau ? "error" : ""}
                />
                {errors.NgayBatDau && (
                  <span className="error-message">{errors.NgayBatDau}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Ngày kết thúc <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="NgayKetThuc"
                  value={formData.NgayKetThuc}
                  onChange={handleChange}
                  className={errors.NgayKetThuc ? "error" : ""}
                />
                {errors.NgayKetThuc && (
                  <span className="error-message">{errors.NgayKetThuc}</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="submit-btn">
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGiay;
