import { useState, useEffect } from "react";
import "./ModalAddHK.scss";

const ModalAddHK = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    SoHoKhau: "",
    QuanHeVoiChuHo: "",
  });

  const [errors, setErrors] = useState({});
  const [hoKhauSuggestions, setHoKhauSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  // Debounce cho tìm kiếm
  useEffect(() => {
    if (searchKeyword) {
      const debounceTimer = setTimeout(() => {
        fetchHoKhauSuggestions(searchKeyword);
      }, 700);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchKeyword]);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        SoHoKhau: "",
        QuanHeVoiChuHo: "",
      });
      setErrors({});
      setHoKhauSuggestions([]);
      setShowSuggestions(false);
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

    if (name === "SoHoKhau" && value.trim()) {
      setSearchKeyword(value);
    } else if (name === "SoHoKhau" && !value.trim()) {
      setShowSuggestions(false);
      setHoKhauSuggestions([]);
    }
  };

  // Fetch hộ khẩu suggestions from API
  const fetchHoKhauSuggestions = async (searchTerm) => {
    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `${apiUrl}/hokhau/search-limited?q=${searchTerm}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Hộ khẩu suggestions data:", data);
      if (data.EC === 0 && data.DT) {
        setHoKhauSuggestions(data.DT.users || []);
        setShowSuggestions(true);
      } else {
        setHoKhauSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching hộ khẩu suggestions:", error);
      setHoKhauSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (hoKhau) => {
    setFormData((prev) => ({
      ...prev,
      SoHoKhau: hoKhau.SoHoKhau,
    }));
    setShowSuggestions(false);
    setHoKhauSuggestions([]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.SoHoKhau.trim()) {
      newErrors.SoHoKhau = "Số hộ khẩu là bắt buộc";
    }

    if (!formData.QuanHeVoiChuHo.trim()) {
      newErrors.QuanHeVoiChuHo = "Quan hệ với chủ hộ là bắt buộc";
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
    <div className="modal-overlay-addhk" onClick={onClose}>
      <div
        className="modal-container-addhk"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-addhk">
          <h2>Vào Hộ Khẩu</h2>
          <button className="close-btn-addhk" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-addhk">
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

            <div className="form-group-addhk">
              <label>
                Số hộ khẩu <span className="required">*</span>
              </label>
              <div className="autocomplete-wrapper">
                <input
                  style={{ width: "100%" }}
                  type="text"
                  name="SoHoKhau"
                  value={formData.SoHoKhau}
                  onChange={handleChange}
                  onFocus={() => {
                    if (
                      formData.SoHoKhau.trim() &&
                      hoKhauSuggestions.length > 0
                    ) {
                      setShowSuggestions(true);
                    }
                  }}
                  className={errors.SoHoKhau ? "error" : ""}
                  placeholder="Nhập số hộ khẩu"
                  autoComplete="off"
                />
                {showSuggestions && hoKhauSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {hoKhauSuggestions.map((hoKhau, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSelectSuggestion(hoKhau)}
                      >
                        <div className="suggestion-main">
                          <strong>{hoKhau.SoHoKhau}</strong>
                        </div>
                        <div className="suggestion-sub">
                          {hoKhau.SoNha +
                            ", " +
                            hoKhau.DuongPho +
                            ", " +
                            hoKhau.Phuong +
                            ", " +
                            hoKhau.Quan || "Chưa có địa chỉ"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {isLoadingSuggestions && (
                  <div className="suggestions-loading">Đang tải...</div>
                )}
              </div>
              {errors.SoHoKhau && (
                <span className="error-message">{errors.SoHoKhau}</span>
              )}
            </div>

            <div className="form-group-addhk">
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
                <span className="error-message">{errors.QuanHeVoiChuHo}</span>
              )}
            </div>
          </div>

          <div className="modal-footer-addhk">
            <button
              type="button"
              className="btn-cancel-addhk"
              onClick={onClose}
            >
              Hủy
            </button>
            <button type="submit" className="btn-submit-addhk">
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddHK;
