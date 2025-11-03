import "./Nhansu.scss";
import { useState, useEffect, use } from "react";
import { ScaleLoader } from "react-spinners";
import ModalNhansu from "./ModalNhansu";
import Themnhansu from "./actions/Themnhansu/Themnhansu";

const Nhansu = (props) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addModalShow, setAddModalShow] = useState(false);

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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const startTime = Date.now();

      const response = await fetch(
        `${apiUrl}/user/pagination?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.EC === 0) {
        setUsers(data.DT.rows || []);
        setTotalPages(parseInt(data.DT.total_page) || 1);
      } else {
        setError(data.EM);
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

      const response = await fetch(
        `${apiUrl}/user/search?account=${searchTerm}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Search users response:", data);
      if (data.EC === 0) {
        setUsers(data.DT.users || []);
      } else {
        setError(data.EM);
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

  // Hàm mở modal chi tiết
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setModalShow(true);
  };

  // Hàm mở modal thêm nhân sự
  const handleAddUser = () => {
    setAddModalShow(true);
  };

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

  return (
    <div className="hk-table-container">
      <div className="hk-header">
        <h3>Danh sách nhân sự</h3>
        <div className="hk-header-actions">
          <input
            type="text"
            placeholder="Tìm theo tài khoản"
            value={search}
            onChange={(e) => handleSearchChange(e)}
          />
          <button className="add-btn" onClick={handleAddUser}>
            + Thêm nhân sự
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>UserId</th>
            <th>Tài khoản</th>
            <th>Chức vụ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "red" }}>
                {error}
              </td>
            </tr>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.UserId}>
                <td>{user.UserId}</td>
                <td>{user.TaiKhoan}</td>
                <td>{user.ChucVu}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => handleViewDetails(user)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Không tìm thấy kết quả
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">{renderPageNumbers()}</div>

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

      {/* Modal Chi tiết User */}
      <ModalNhansu
        show={modalShow}
        onHide={() => setModalShow(false)}
        user={selectedUser}
        setUsers={setUsers}
        fetchUsers={fetchUsers}
      />

      {/* Modal Thêm Nhân Sự */}
      <Themnhansu
        show={addModalShow}
        onHide={() => setAddModalShow(false)}
        fetchUsers={fetchUsers}
      />
    </div>
  );
};
export default Nhansu;
