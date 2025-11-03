import { useState, useEffect } from "react";
import "./AddNK.scss";

const AddNK = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    HoTen: "",
    BiDanh: "",
    GioiTinh: "",
    NgaySinh: "",
    NoiSinh: "",
    NguyenQuan: "",
    DanToc: "",
    NgheNghiep: "",
    NoiLamViec: "",
    CCCD: "",
    NgayCapCCCD: "",
    NoiCapCCCD: "",
    NgayDangKyThuongTru: "",
    DiaChiCu: "",
    TrangThai: "",
    SoHoKhau: "",
    QuanHeVoiChuHo: "",
    GhiChu: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        HoTen: "",
        BiDanh: "",
        GioiTinh: "",
        NgaySinh: "",
        NoiSinh: "",
        NguyenQuan: "",
        DanToc: "",
        NgheNghiep: "",
        NoiLamViec: "",
        CCCD: "",
        NgayCapCCCD: "",
        NoiCapCCCD: "",
        NgayDangKyThuongTru: "",
        DiaChiCu: "",
        TrangThai: "",
        SoHoKhau: "",
        QuanHeVoiChuHo: "",
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
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.HoTen.trim()) {
      newErrors.HoTen = "Họ và tên là bắt buộc";
    }

    if (!formData.GioiTinh) {
      newErrors.GioiTinh = "Giới tính là bắt buộc";
    }

    if (!formData.NgaySinh) {
      newErrors.NgaySinh = "Ngày tháng năm sinh là bắt buộc";
    }

    if (!formData.NoiSinh.trim()) {
      newErrors.NoiSinh = "Nơi sinh là bắt buộc";
    }

    if (!formData.NguyenQuan.trim()) {
      newErrors.NguyenQuan = "Nguyên quán là bắt buộc";
    }

    if (!formData.DanToc.trim()) {
      newErrors.DanToc = "Dân tộc là bắt buộc";
    }

    if (!formData.NgayDangKyThuongTru) {
      newErrors.NgayDangKyThuongTru = "Ngày đăng ký thường trú là bắt buộc";
    }
    if (!formData.CCCD) {
      newErrors.CCCD = "CCCD là bắt buộc";
    }

    if (!formData.TrangThai) {
      newErrors.TrangThai = "Trạng thái là bắt buộc";
    }

    if (formData.TrangThai === "O_HO_KHAU") {
      if (!formData.SoHoKhau.trim()) {
        newErrors.SoHoKhau = "Số hộ khẩu là bắt buộc";
      }

      if (!formData.QuanHeVoiChuHo.trim()) {
        newErrors.QuanHeVoiChuHo = "Quan hệ với chủ hộ là bắt buộc";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm Nhân Khẩu</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>
                  Họ & tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="HoTen"
                  value={formData.HoTen}
                  onChange={handleChange}
                  className={errors.HoTen ? "error" : ""}
                  placeholder="Nhập họ và tên"
                />
                {errors.HoTen && (
                  <span className="error-message">{errors.HoTen}</span>
                )}
              </div>

              <div className="form-group">
                <label>Bí danh</label>
                <input
                  type="text"
                  name="BiDanh"
                  value={formData.BiDanh}
                  onChange={handleChange}
                  placeholder="Nhập bí danh"
                />
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
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                {errors.GioiTinh && (
                  <span className="error-message">{errors.GioiTinh}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Ngày tháng năm sinh <span className="required">*</span>
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
                  Nơi sinh <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="NoiSinh"
                  value={formData.NoiSinh}
                  onChange={handleChange}
                  className={errors.NoiSinh ? "error" : ""}
                  placeholder="Nhập nơi sinh"
                />
                {errors.NoiSinh && (
                  <span className="error-message">{errors.NoiSinh}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Nguyên quán <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="NguyenQuan"
                  value={formData.NguyenQuan}
                  onChange={handleChange}
                  className={errors.NguyenQuan ? "error" : ""}
                  placeholder="Nhập nguyên quán"
                />
                {errors.NguyenQuan && (
                  <span className="error-message">{errors.NguyenQuan}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Dân tộc <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="DanToc"
                  value={formData.DanToc}
                  onChange={handleChange}
                  className={errors.DanToc ? "error" : ""}
                  placeholder="Nhập dân tộc"
                />
                {errors.DanToc && (
                  <span className="error-message">{errors.DanToc}</span>
                )}
              </div>

              <div className="form-group">
                <label>Nghề nghiệp</label>
                <input
                  type="text"
                  name="NgheNghiep"
                  value={formData.NgheNghiep}
                  onChange={handleChange}
                  placeholder="Nhập nghề nghiệp"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nơi làm việc</label>
                <input
                  type="text"
                  name="NoiLamViec"
                  value={formData.NoiLamViec}
                  onChange={handleChange}
                  placeholder="Nhập nơi làm việc"
                />
              </div>

              <div className="form-group">
                <label>
                  CMND/CCCD <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="CCCD"
                  value={formData.CCCD}
                  onChange={handleChange}
                  placeholder="Nhập số CMND/CCCD"
                  className={errors.CCCD ? "error" : ""}
                />
                {errors.CCCD && (
                  <span className="error-message">{errors.CCCD}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngày cấp</label>
                <input
                  type="date"
                  name="NgayCapCCCD"
                  value={formData.NgayCapCCCD}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Nơi cấp</label>
                <input
                  type="text"
                  name="NoiCapCCCD"
                  value={formData.NoiCapCCCD}
                  onChange={handleChange}
                  placeholder="Nhập nơi cấp"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Ngày đăng ký thường trú <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="NgayDangKyThuongTru"
                  value={formData.NgayDangKyThuongTru}
                  onChange={handleChange}
                  className={errors.NgayDangKyThuongTru ? "error" : ""}
                />
                {errors.NgayDangKyThuongTru && (
                  <span className="error-message">
                    {errors.NgayDangKyThuongTru}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>
                  Trạng thái <span className="required">*</span>
                </label>
                <select
                  name="TrangThai"
                  value={formData.TrangThai}
                  onChange={handleChange}
                  className={errors.TrangThai ? "error" : ""}
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="O_HO_KHAU">Ở hộ khẩu</option>
                  <option value="DA_QUA_DOI">Đã qua đời</option>
                  <option value="CHUYEN_HO_KHAU">Chuyển hộ khẩu</option>
                </select>
                {errors.TrangThai && (
                  <span className="error-message">{errors.TrangThai}</span>
                )}
              </div>
            </div>

            {formData.TrangThai === "O_HO_KHAU" && (
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Số hộ khẩu <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="SoHoKhau"
                    value={formData.SoHoKhau}
                    onChange={handleChange}
                    className={errors.SoHoKhau ? "error" : ""}
                    placeholder="Nhập số hộ khẩu"
                  />
                  {errors.SoHoKhau && (
                    <span className="error-message">{errors.SoHoKhau}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Quan hệ với chủ hộ <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="QuanHeVoiChuHo"
                    value={formData.QuanHeVoiChuHo}
                    onChange={handleChange}
                    className={errors.QuanHeVoiChuHo ? "error" : ""}
                    placeholder="Vd: Con, Vợ, Chồng..."
                  />
                  {errors.QuanHeVoiChuHo && (
                    <span className="error-message">
                      {errors.QuanHeVoiChuHo}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group full-width">
                <label>Địa chỉ nơi thường trú trước khi chuyển đến</label>
                <input
                  type="text"
                  name="DiaChiCu"
                  value={formData.DiaChiCu}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ trước khi chuyển đến"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Ghi chú</label>
                <textarea
                  name="GhiChu"
                  value={formData.GhiChu}
                  onChange={handleChange}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit">
              Thêm nhân khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNK;
