import { useEffect, useState } from "react";
import "./AddHK.scss";

const AddHK = ({ show, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    soHoKhau: "",
    soNha: "",
    duongPho: "",
    phuong: "",
    quan: "",
    quanCode: "", // Lưu code để fetch phường
    phuongCode: "", // Lưu code của phường
  });

  const [chuHoOption, setChuHoOption] = useState("taoMoi"); // "taoMoi" hoặc "chonNhanKhau"
  const [chuHoData, setChuHoData] = useState({
    hoTen: "",
    ngaySinh: "", // Format: "YYYY-MM-DD HH:MM:SS"
    gioiTinh: true,
    soCMND: "",
    noiDung: "",
    ngayDoi: "",
  });

  const [selectedNhanKhau, setSelectedNhanKhau] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showNhanKhauList, setShowNhanKhauList] = useState(false);
  const [errors, setErrors] = useState({});
  const [quanHuyenList, setQuanHuyenList] = useState([]);
  const [phuongXaList, setPhuongXaList] = useState([]);
  const [nhanKhauList, setNhanKhauList] = useState([]);
  const API_URL_QUAN_HUYEN = process.env.REACT_APP_QUAN_HUYEN_URL;
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchQuanHuyen = async () => {
      try {
        const res = await fetch(
          `${API_URL_QUAN_HUYEN}/provinces/01/districts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        console.log("Danh sách quận/huyện:", data?.data);
        setQuanHuyenList(data?.data || []);
      } catch (error) {
        console.error("Lỗi khi fetch quận/huyện:", error);
      }
    };
    fetchQuanHuyen();
  }, []);

  useEffect(() => {
    const fetchPhuongXa = async () => {
      if (!formData.quanCode) {
        setPhuongXaList([]);
        return;
      }

      try {
        const res = await fetch(
          `${API_URL_QUAN_HUYEN}/districts/${formData.quanCode}/wards`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        setPhuongXaList(data?.data || []);
      } catch (error) {
        console.error("Lỗi khi fetch phường/xã:", error);
      }
    };
    fetchPhuongXa();
  }, [formData.quanCode]);

  // Debounce cho tìm kiếm
  useEffect(() => {
    if (searchKeyword) {
      const debounceTimer = setTimeout(() => {
        handleSearch(searchKeyword);
      }, 700);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchKeyword]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quan") {
      // Tìm tên quận/huyện từ code
      const selectedQuan = quanHuyenList.find((q) => q.code === value);
      setFormData({
        ...formData,
        [name]: selectedQuan ? selectedQuan.name : value,
        phuong: "",
        phuongCode: "",
        quanCode: value,
      });
    } else if (name === "phuong") {
      // Tìm tên phường/xã từ code
      const selectedPhuong = phuongXaList.find((p) => p.code === value);
      setFormData({
        ...formData,
        [name]: selectedPhuong ? selectedPhuong.name : value,
        phuongCode: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Xóa lỗi khi người dùng nhập
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleChuHoChange = (e) => {
    const { name, value } = e.target;
    const finalValue =
      name === "ngaySinh" ? (value ? `${value} 00:00:00` : "") : value;

    setChuHoData({
      ...chuHoData,
      [name]: finalValue,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate thông tin hộ khẩu
    if (!formData.soHoKhau.trim())
      newErrors.soHoKhau = "Số hộ khẩu là bắt buộc";
    if (!formData.soNha.trim()) newErrors.soNha = "Số nhà là bắt buộc";
    if (!formData.duongPho.trim()) newErrors.duongPho = "Đường phố là bắt buộc";
    if (!formData.phuong.trim()) newErrors.phuong = "Phường là bắt buộc";
    if (!formData.quan.trim()) newErrors.quan = "Quận là bắt buộc";

    // Validate chủ hộ
    if (chuHoOption === "taoMoi") {
      if (!chuHoData.hoTen.trim()) newErrors.hoTen = "Họ tên là bắt buộc";
      if (!chuHoData.ngaySinh) newErrors.ngaySinh = "Ngày sinh là bắt buộc";
      if (!chuHoData.soCMND.trim())
        newErrors.soCMND = "Số CMND/CCCD là bắt buộc";
    } else {
      if (!selectedNhanKhau) newErrors.nhanKhau = "Vui lòng chọn nhân khẩu";
      if (!chuHoData.ngayDoi) newErrors.ngayDoi = "Ngày đổi là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    let chuHoDataToSubmit;
    if (chuHoOption === "taoMoi") {
      chuHoDataToSubmit = chuHoData;
    } else {
      chuHoDataToSubmit = selectedNhanKhau || null;
    }
    const submitData = {
      hoKhau: formData,
      chuHo: {
        option: chuHoOption,
        data: chuHoDataToSubmit,
        noiDung: chuHoData.noiDung,
        ngayDoi: chuHoData.ngayDoi,
      },
    };
    onSubmit(submitData);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      soHoKhau: "",
      soNha: "",
      duongPho: "",
      phuong: "",
      quan: "",
      quanCode: "",
      phuongCode: "",
    });
    setChuHoData({
      hoTen: "",
      ngaySinh: "",
      gioiTinh: true,
      soCMND: "",
      noiDung: "",
      ngayDoi: "",
    });
    setChuHoOption("taoMoi");
    setSelectedNhanKhau(null);
    setSearchKeyword("");
    setShowNhanKhauList(false);
    setErrors({});
    onClose();
  };

  // Xử lý khi chọn nhân khẩu từ danh sách
  const handleSelectNhanKhau = (nhanKhau) => {
    setSelectedNhanKhau(nhanKhau);
    setSearchKeyword(`${nhanKhau.HoTen} - ${nhanKhau.CCCD}`);
    setShowNhanKhauList(false);
    if (errors.nhanKhau) {
      setErrors({ ...errors, nhanKhau: "" });
    }
  };

  const handleSearch = async (searchTerm) => {
    try {
      const response = await fetch(
        `${apiUrl}/nhankhau/search?q=${searchTerm}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Kết quả tìm kiếm nhân khẩu:", data);
      if (data.EC === 0) {
        setNhanKhauList(data.DT.users || []);
      } else {
        setNhanKhauList([]);
      }
    } catch (e) {
      console.error("Error fetching nhân khẩu:", e);
      setNhanKhauList([]);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Thêm hộ khẩu mới</h3>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Thông tin hộ khẩu */}
          <div className="form-section">
            <h4>Thông tin hộ khẩu</h4>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Số hộ khẩu <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="soHoKhau"
                  value={formData.soHoKhau}
                  onChange={handleChange}
                  placeholder="Nhập số hộ khẩu - VD: MK123456"
                  className={errors.soHoKhau ? "error" : ""}
                />
                {errors.soHoKhau && (
                  <span className="error-message">{errors.soHoKhau}</span>
                )}
              </div>
              <div className="form-group">
                <label>
                  Số nhà <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="soNha"
                  value={formData.soNha}
                  onChange={handleChange}
                  placeholder="Nhập số nhà"
                  className={errors.soNha ? "error" : ""}
                />
                {errors.soNha && (
                  <span className="error-message">{errors.soNha}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Đường phố (ấp) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="duongPho"
                  value={formData.duongPho}
                  onChange={handleChange}
                  placeholder="Nhập đường phố"
                  className={errors.duongPho ? "error" : ""}
                />
                {errors.duongPho && (
                  <span className="error-message">{errors.duongPho}</span>
                )}
              </div>
              <div className="form-group">
                <label>
                  Quận (huyện) <span className="required">*</span>
                </label>
                <select
                  name="quan"
                  value={formData.quanCode}
                  onChange={handleChange}
                  className={errors.quan ? "error" : ""}
                >
                  <option value="">-- Chọn quận/huyện --</option>
                  {quanHuyenList.map((quan) => (
                    <option key={quan.code} value={quan.code}>
                      {quan.name}
                    </option>
                  ))}
                </select>
                {errors.quan && (
                  <span className="error-message">{errors.quan}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Phường (xã, thị trấn) <span className="required">*</span>
                </label>
                <select
                  name="phuong"
                  value={formData.phuongCode}
                  onChange={handleChange}
                  className={errors.phuong ? "error" : ""}
                  disabled={!formData.quan}
                >
                  <option value="">
                    {!formData.quan
                      ? "-- Vui lòng chọn quận/huyện trước --"
                      : "-- Chọn phường/xã --"}
                  </option>
                  {phuongXaList.map((phuong) => (
                    <option key={phuong.code} value={phuong.code}>
                      {phuong.name}
                    </option>
                  ))}
                </select>
                {errors.phuong && (
                  <span className="error-message">{errors.phuong}</span>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin chủ hộ */}
          <div className="form-section">
            <h4>Thông tin chủ hộ</h4>

            <div className="option-tabs">
              <button
                type="button"
                className={chuHoOption === "taoMoi" ? "active" : ""}
                onClick={() => setChuHoOption("taoMoi")}
              >
                Tạo chủ hộ mới
              </button>
              <button
                type="button"
                className={chuHoOption === "chonNhanKhau" ? "active" : ""}
                onClick={() => setChuHoOption("chonNhanKhau")}
              >
                Chọn từ nhân khẩu
              </button>
            </div>

            {chuHoOption === "taoMoi" ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Họ và tên <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="hoTen"
                      value={chuHoData.hoTen}
                      onChange={handleChuHoChange}
                      placeholder="Nhập họ tên"
                      className={errors.hoTen ? "error" : ""}
                    />
                    {errors.hoTen && (
                      <span className="error-message">{errors.hoTen}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>
                      Ngày sinh <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="ngaySinh"
                      value={
                        chuHoData.ngaySinh
                          ? chuHoData.ngaySinh.split(" ")[0]
                          : ""
                      }
                      onChange={handleChuHoChange}
                      className={errors.ngaySinh ? "error" : ""}
                    />
                    {errors.ngaySinh && (
                      <span className="error-message">{errors.ngaySinh}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      name="gioiTinh"
                      value={chuHoData.gioiTinh}
                      onChange={handleChuHoChange}
                    >
                      <option value={true}>Nam</option>
                      <option value={false}>Nữ</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      Số CMND/CCCD <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="soCMND"
                      value={chuHoData.soCMND}
                      onChange={handleChuHoChange}
                      placeholder="Nhập số CMND/CCCD"
                      className={errors.soCMND ? "error" : ""}
                    />
                    {errors.soCMND && (
                      <span className="error-message">{errors.soCMND}</span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-group nhankhau-search">
                  <label>
                    Chọn nhân khẩu <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setShowNhanKhauList(true);
                      if (!e.target.value) {
                        setSelectedNhanKhau(null);
                      }
                    }}
                    onFocus={() => setShowNhanKhauList(true)}
                    placeholder="Tìm kiếm theo tên hoặc CMND/CCCD"
                    className={errors.nhanKhau ? "error" : ""}
                  />
                  {errors.nhanKhau && (
                    <span className="error-message">{errors.nhanKhau}</span>
                  )}

                  {showNhanKhauList && searchKeyword && (
                    <div className="nhankhau-dropdown">
                      {nhanKhauList.length > 0 ? (
                        nhanKhauList.map((nhanKhau) => (
                          <div
                            key={nhanKhau.NhanKhauId}
                            className="nhankhau-item"
                            onClick={() => handleSelectNhanKhau(nhanKhau)}
                          >
                            <div className="nhankhau-name">
                              {nhanKhau.HoTen}
                            </div>
                            <div className="nhankhau-info">
                              CMND: {nhanKhau.CCCD} | Ngày sinh:{" "}
                              {nhanKhau.NgaySinh.split(" ")[0]}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="nhankhau-item no-result">
                          Không tìm thấy nhân khẩu
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nội dung</label>
                    <input
                      type="text"
                      name="noiDung"
                      value={chuHoData.noiDung}
                      onChange={handleChuHoChange}
                      placeholder="Nhập nội dung"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Ngày đổi <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="ngayDoi"
                      value={chuHoData.ngayDoi}
                      onChange={handleChuHoChange}
                      className={errors.ngayDoi ? "error" : ""}
                    />
                    {errors.ngayDoi && (
                      <span className="error-message">{errors.ngayDoi}</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer buttons */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit">
              Thêm hộ khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHK;
