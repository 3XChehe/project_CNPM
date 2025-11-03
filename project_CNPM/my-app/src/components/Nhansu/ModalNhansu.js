import "./ModalNhansu.scss";
import { useState } from "react";
import ModalXoa from "./actions/Xoa/Modalxoa";
import ModalDoimk from "./actions/DoiMatKhau/ModalDoimk";
import toast from "react-hot-toast";

const ModalNhansu = ({ show, onHide, user, setUsers }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  if (!show) return null;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleChangePasswordClick = () => {
    setShowChangePasswordModal(true);
  };

  const confirmDelete = async () => {
    console.log("Xóa user:", user);
    // TODO: Gọi API xóa user
    try {
      // xoá user ở state
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.UserId !== user.UserId)
      );
      const res = await fetch(`${apiUrl}/user/delete/${user?.UserId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      console.log("Xóa user thành công:", data);
      onHide();
      toast.success("Xóa user thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
    }
  };

  const confirmChangePassword = async (newPassword) => {
    try {
      const res = await fetch(`${apiUrl}/user/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ UserId: user.UserId, newPassword }),
      });
      const data = await res.json();
      setShowChangePasswordModal(false);
      onHide();
      toast.success("Đổi mật khẩu thành công!");
    } catch (err) {
      console.error("Lỗi khi đổi mật khẩu:", err);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onHide}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Chi tiết người dùng</h2>
            <button className="close-btn" onClick={onHide}>
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="info-row">
              <span className="label">User ID:</span>
              <span className="value">{user?.UserId || "N/A"}</span>
            </div>

            <div className="info-row">
              <span className="label">Tài khoản:</span>
              <span className="value">{user?.TaiKhoan || "N/A"}</span>
            </div>

            <div className="info-row">
              <span className="label">Chức vụ:</span>
              <span className="value">{user?.ChucVu || "N/A"}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-delete" onClick={handleDeleteClick}>
              <p className="text-btn">Xoá account</p>
            </button>
            <button className="btn-close" onClick={handleChangePasswordClick}>
              <p className="text-btn"> Đổi mật khẩu</p>
            </button>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <ModalXoa
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        userName={user?.TaiKhoan}
      />

      {/* Modal đổi mật khẩu */}
      <ModalDoimk
        show={showChangePasswordModal}
        onHide={() => setShowChangePasswordModal(false)}
        onConfirm={confirmChangePassword}
        userName={user?.TaiKhoan}
        UserId={user?.UserId}
      />
    </>
  );
};

export default ModalNhansu;
