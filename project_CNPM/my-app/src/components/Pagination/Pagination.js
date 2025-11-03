import React from "react";
import "./Pagination.scss";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Tạo danh sách số trang với logic hiển thị thông minh
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số trang tối đa hiển thị
    const halfRange = Math.floor(maxPagesToShow / 2);

    // Nút trang đầu tiên
    if (currentPage > halfRange + 1) {
      pageNumbers.push(
        <button key={1} className="page-number" onClick={() => onPageChange(1)}>
          1
        </button>
      );
      if (currentPage > halfRange + 2) {
        pageNumbers.push(
          <span key="ellipsis-start" className="ellipsis">
            ...
          </span>
        );
      }
    }

    // Tính toán phạm vi trang hiển thị
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    // Điều chỉnh để luôn hiển thị đủ số trang
    if (endPage - startPage + 1 < maxPagesToShow) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
    }

    // Render các trang trong phạm vi
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`page-number ${currentPage === i ? "active" : ""}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Nút trang cuối cùng
    if (currentPage < totalPages - halfRange) {
      if (currentPage < totalPages - halfRange - 1) {
        pageNumbers.push(
          <span key="ellipsis-end" className="ellipsis">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          className="page-number"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination">
      <button
        className="page-nav-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Trước
      </button>
      {renderPageNumbers()}
      <button
        className="page-nav-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Tiếp →
      </button>
    </div>
  );
};

export default Pagination;
