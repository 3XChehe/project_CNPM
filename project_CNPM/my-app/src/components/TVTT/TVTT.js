import "./TVTT.scss";
import { useState, useEffect, use } from "react";
import { ScaleLoader } from "react-spinners";
import AddGiay from "./actions/AddGiay";
import toast from "react-hot-toast";
import { formattedDate } from "../../helper";

const TVTT = (props) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    marginTop: "-100px",
  };
  useEffect(() => {
    if (!search) {
      fetchUsers();
    }
  }, [page, limit]);

  // Debounce cho tìm kiếm
  useEffect(() => {
    if (search) {
      const debounceTimer = setTimeout(() => {
        handleSearch(search);
      }, 700);

      return () => clearTimeout(debounceTimer);
    }
  }, [search]);

  const genderMap = (gender) => {
    if (gender) return "Nam";
    else return "Nữ";
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const startTime = Date.now();

      const response = await fetch(
        `${apiUrl}/tvtt/pagination?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Fetched data:", data);

      if (data?.EC === 0) {
        setUsers(data?.DT?.rows || []);
        setTotalPages(parseInt(data?.DT?.total_page) || 1);
      } else {
        setError(data?.EM);
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(400 - elapsedTime, 0);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    } catch (err) {
      setError("Lỗi kết nối đến server");
      console.error(err);
      await new Promise((resolve) => setTimeout(resolve, 400));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    setSearch(e.target.value);
    if (!e.target.value) {
      fetchUsers();
    }
  };

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      const startTime = Date.now();

      const response = await fetch(`${apiUrl}/tvtt/search?q=${searchTerm}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data?.EC === 0) {
        setUsers(data?.DT?.results || []);
      } else {
        setError(data?.EM);
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(400 - elapsedTime, 0);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    } catch (e) {
      console.error("Error fetching users:", e);
      setError("Lỗi khi tìm kiếm");
      await new Promise((resolve) => setTimeout(resolve, 400));
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  const filteredUsers = users;

  // Hàm chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Tạo danh sách số trang
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`page-number ${page === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handleAddGiay = async (formData) => {
    setLoading(true);
    console.log("Submitting form data:", formData);
    try {
      const response = await fetch(`${apiUrl}/tvtt/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data?.EC === 0) {
        // Đóng modal
        setIsModalOpen(false);
        fetchUsers();
        toast.success("Tạo giấy thành công!");
      } else {
        toast.error(data?.EM || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error creating:", error);
      toast.error("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hk-table-container">
      <div className="hk-header">
        <h3>Danh sách tạm vắng - tạm trú</h3>
        <div className="hk-header-actions">
          <input
            type="text"
            placeholder="Tìm theo tài khoản"
            value={search}
            onChange={(e) => handleSearchChange(e)}
          />
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            + Tạo giấy
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>TVTTId</th>
            <th>Loại giấy tờ</th>
            <th>Họ & tên</th>
            <th>CMND/CCCD</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Số hộ khẩu</th>
            <th>Lý do</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", color: "red" }}>
                {error}
              </td>
            </tr>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user?.TVTTId}>
                <td>{user?.TVTTId}</td>
                <td>{user?.LoaiGiay}</td>
                <td>{user?.HoTen}</td>
                <td>{user?.CCCD}</td>
                <td>{formattedDate(user?.NgaySinh)}</td>
                <td>{genderMap(user?.GioiTinh)}</td>
                <td>{user?.SoHoKhau}</td>
                <td>{user?.LyDo}</td>
                <td>
                  {formattedDate(user?.NgayBatDau)} -{" "}
                  {formattedDate(user?.NgayKetThuc)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                Không tìm thấy kết quả
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">{renderPageNumbers()}</div>

      {/* Modal thêm giấy */}
      <AddGiay
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddGiay}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <ScaleLoader
            color={"#00000080"}
            loading={loading}
            cssOverride={override}
            size={200}
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
};
export default TVTT;
