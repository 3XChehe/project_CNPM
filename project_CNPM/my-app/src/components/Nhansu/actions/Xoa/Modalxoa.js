import "./Modalxoa.scss";

const ModalXoa = ({ show, onHide, onConfirm, userName }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-delete-overlay" onClick={onHide}>
        <div
          className="modal-delete-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-delete-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc3545"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>

          <div className="modal-delete-body">
            <h2>Xác nhận xóa tài khoản</h2>
            <p>
              Bạn có chắc chắn muốn xóa tài khoản{" "}
              <strong>{userName || "này"}</strong> không?
            </p>
            <p className="warning-text">Hành động này không thể hoàn tác!</p>
          </div>

          <div className="modal-delete-footer">
            <button className="btn-cancel" onClick={onHide}>
              Quay lại
            </button>
            <button className="btn-confirm" onClick={onConfirm}>
              TIẾP TỤC XOÁ
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalXoa;
