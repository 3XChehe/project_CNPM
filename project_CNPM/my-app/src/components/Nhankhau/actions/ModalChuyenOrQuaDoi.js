import { useState, useEffect } from "react";
import "./ModalChuyenOrQuaDoi.scss";

const ModalChuyenOrQuaDoi = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    LoaiThayDoi: "",
    NgayChuyenDi: "",
    GhiChu: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        LoaiThayDoi: "",
        NgayChuyenDi: "",
        GhiChu: "",
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

    if (!formData.LoaiThayDoi) {
      newErrors.LoaiThayDoi = "Loại thay đổi là bắt buộc";
    }

    if (!formData.NgayChuyenDi) {
      newErrors.NgayChuyenDi = "Ngày chuyển đi là bắt buộc";
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
    <div className="modal-overlay-chuyen" onClick={onClose}>
      <div
        className="modal-container-chuyen"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-chuyen">
          <h2>Thay Đổi Trạng Thái Nhân Khẩu</h2>
          <button className="close-btn-chuyen" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-chuyen">
            {currentUser && (
              <div className="user-info">
                <p>
                  <strong>Họ tên:</strong> {currentUser.HoTen}
                </p>
                <p>
                  <strong>CCCD:</strong> {currentUser.CCCD}
                </p>
              </div>
            )}

            <div className="form-group-chuyen">
              <label>
                Loại thay đổi <span className="required">*</span>
              </label>
              <select
                name="LoaiThayDoi"
                value={formData.LoaiThayDoi}
                onChange={handleChange}
                className={errors.LoaiThayDoi ? "error" : ""}
              >
                <option value="">Chọn loại thay đổi</option>
                <option value="CHUYEN_HO_KHAU">Chuyển hộ khẩu</option>
                <option value="DA_QUA_DOI">Qua đời</option>
              </select>
              {errors.LoaiThayDoi && (
                <span className="error-message">{errors.LoaiThayDoi}</span>
              )}
            </div>

            <div className="form-group-chuyen">
              <label>
                Ngày chuyển đi <span className="required">*</span>
              </label>
              <input
                type="date"
                name="NgayChuyenDi"
                value={formData.NgayChuyenDi}
                onChange={handleChange}
                className={errors.NgayChuyenDi ? "error" : ""}
              />
              {errors.NgayChuyenDi && (
                <span className="error-message">{errors.NgayChuyenDi}</span>
              )}
            </div>

            <div className="form-group-chuyen">
              <label>Ghi chú</label>
              <textarea
                name="GhiChu"
                value={formData.GhiChu}
                onChange={handleChange}
                placeholder="Nhập ghi chú (nếu có)"
                rows="4"
              />
            </div>
          </div>

          <div className="modal-footer-chuyen">
            <button
              type="button"
              className="btn-cancel-chuyen"
              onClick={onClose}
            >
              Hủy
            </button>
            <button type="submit" className="btn-submit-chuyen">
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalChuyenOrQuaDoi;
