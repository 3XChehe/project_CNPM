import "./Hokhau.scss";
import { useState, useEffect, use } from "react";
import { ScaleLoader } from "react-spinners";
import Pagination from "../Pagination/Pagination";
import AddHK from "./actionss/AddHK";
import XemNK from "./actionss/XemNK";
import toast from "react-hot-toast";
import { formattedDate } from "../../helper";

const HoKhau = (props) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [addModalShow, setAddModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [selectedHoKhau, setSelectedHoKhau] = useState(null);

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
        setPage(1); // Reset về trang 1 khi tìm kiếm mới
        handleSearch(search);
      }, 700);

      return () => clearTimeout(debounceTimer);
    }
  }, [search]);

  // Effect để xử lý phân trang khi ở chế độ tìm kiếm
  useEffect(() => {
    if (isSearchMode && search) {
      handleSearch(search);
    }
  }, [page, limit, isSearchMode]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const startTime = Date.now();

      const response = await fetch(
        `${apiUrl}/hokhau/pagination?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Fetch users response:", data);

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
      setIsSearchMode(false);
      setPage(1);
      fetchUsers();
    }
  };

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setError(null);
    setIsSearchMode(true);

    try {
      const startTime = Date.now();

      const response = await fetch(
        `${apiUrl}/hokhau/search?q=${searchTerm}&page=${page}&limit=${limit}`,
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
        setUsers(data.DT.results || []);
        setTotalPages(parseInt(data.DT.total_page) || 1);
      } else {
        setError(data.EM);
        setUsers([]);
        setTotalPages(1);
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(400 - elapsedTime, 0);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    } catch (e) {
      console.error("Error fetching users:", e);
      setError("Lỗi khi tìm kiếm");
      setUsers([]);
      setTotalPages(1);
      await new Promise((resolve) => setTimeout(resolve, 400));
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  const filteredUsers = users;

  const handleViewDetails = async (user) => {
    console.log("Selected HoKhau for details:", user);
    setSelectedHoKhau(user);
    setViewModalShow(true);
  };

  const handleAddHK = () => {
    setAddModalShow(true);
  };

  // Hàm xử lý thêm hộ khẩu
  const handleSubmitAddHK = async (data) => {
    console.log("Dữ liệu hộ khẩu mới:", data);

    try {
      // TODO: Gọi API để thêm hộ khẩu
      const response = await fetch(`${apiUrl}/hokhau/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Kết quả thêm hộ khẩu:", result);
      if (result.EC === 0) {
        setAddModalShow(false);
        toast.success("Thêm hộ khẩu thành công!");
        fetchUsers();
      } else {
        toast.error(result.EM || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm hộ khẩu:", error);
      alert("Có lỗi xảy ra khi thêm hộ khẩu!");
    }
  };

  // Hàm chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="hk-table-container">
      <div className="hk-header">
        <h3>Danh sách hộ khẩu</h3>
        <div className="hk-header-actions">
          <input
            type="text"
            placeholder="Tìm theo các cột"
            value={search}
            onChange={(e) => handleSearchChange(e)}
          />
          <button className="add-btn" onClick={handleAddHK}>
            + Thêm hộ khẩu
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>HoKhauId</th>
            <th>SoNha</th>
            <th>DuongPho</th>
            <th>Phuong</th>
            <th>Quan</th>
            <th>SoHoKhau</th>
            <th>NgayLap</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "red" }}>
                {error}
              </td>
            </tr>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user?.HoKhauId}>
                <td>{user?.HoKhauId}</td>
                <td>{user?.SoNha}</td>
                <td>{user?.DuongPho}</td>
                <td>{user?.Phuong}</td>
                <td>{user?.Quan}</td>
                <td>{user?.SoHoKhau}</td>
                <td>{formattedDate(user?.NgayLap)}</td>
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
              <td colSpan="7" style={{ textAlign: "center" }}>
                Không tìm thấy kết quả
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
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

      {/* Modal thêm hộ khẩu */}
      <AddHK
        show={addModalShow}
        onClose={() => setAddModalShow(false)}
        onSubmit={handleSubmitAddHK}
      />

      {/* Modal xem nhân khẩu */}
      <XemNK
        isOpen={viewModalShow}
        onClose={() => setViewModalShow(false)}
        hoKhauData={selectedHoKhau}
      />
    </div>
  );
};
export default HoKhau;
