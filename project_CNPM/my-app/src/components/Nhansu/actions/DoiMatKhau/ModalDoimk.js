import "./ModalDoimk.scss";
import { useState } from "react";

const ModalDoimk = ({ show, onHide, onConfirm, userName, UserId }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  if (!show) return null;

  const handleSubmit = async () => {
    setError("");

    // Validate
    if (!newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    onConfirm(newPassword);

    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onHide();
  };

  return (
    <>
      <div className="modal-password-overlay" onClick={handleClose}>
        <div
          className="modal-password-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-password-header">
            <h2>Đổi mật khẩu</h2>
            <button className="close-btn" onClick={handleClose}>
              ×
            </button>
          </div>

          <div className="modal-password-body">
            <p className="user-info">
              Đổi mật khẩu cho tài khoản: <strong>{userName || "N/A"}</strong>
            </p>

            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới:</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="modal-password-footer">
            <button className="btn-cancel" onClick={handleClose}>
              Quay lại
            </button>
            <button className="btn-confirm" onClick={handleSubmit}>
              TIẾP TỤC
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDoimk;
