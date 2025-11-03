import "./Nhankhau.scss";
import { useState, useEffect, use } from "react";
import { ScaleLoader } from "react-spinners";
import Pagination from "../Pagination/Pagination";
import toast from "react-hot-toast";
import { formattedDate } from "../../helper";
import AddNK from "./actions/AddNK";
import ModalChuyenOrQuaDoi from "./actions/ModalChuyenOrQuaDoi";
import ModalAddHK from "./actions/ModalAddHK";

const NhanKhau = (props) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChuyenModalOpen, setIsChuyenModalOpen] = useState(false);
  const [isAddHKModalOpen, setIsAddHKModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
        `${apiUrl}/nhankhau/pagination?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Fetch users response Nhan Khau:", data);

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
        `${apiUrl}/nhankhau/search-detail?q=${searchTerm}&page=${page}&limit=${limit}`,
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
  };

  const handleAddHK = () => {
    setIsAddModalOpen(true);
  };

  // Hàm mở modal chuyển/qua đời
  const handleOpenChuyenModal = (user) => {
    setSelectedUser(user);
    setIsChuyenModalOpen(true);
  };

  // Hàm mở modal vào hộ khẩu
  const handleOpenAddHKModal = (user) => {
    setSelectedUser(user);
    setIsAddHKModalOpen(true);
  };

  // Hàm xử lý thay đổi trạng thái
  const handleSubmitChuyenOrQuaDoi = async (data) => {
    const dataTotal = {
      NhanKhauId: selectedUser.NhanKhauId,
      ...data,
    };
    console.log("Dữ liệu thay đổi trạng thái:", dataTotal);

    try {
      // TODO: Gọi API để cập nhật trạng thái nhân khẩu
      const response = await fetch(`${apiUrl}/nhankhau/change-trangthai`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataTotal),
      });

      const result = await response.json();
      console.log("Kết quả cập nhật trạng thái:", result);

      if (result.EC === 0) {
        toast.success("Cập nhật trạng thái thành công!");
        setIsChuyenModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error(result.EM || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  // Hàm xử lý vào hộ khẩu
  const handleSubmitAddHK = async (data) => {
    const dataTotal = {
      NhanKhauId: selectedUser.NhanKhauId,
      ...data,
    };
    console.log("Dữ liệu vào hộ khẩu:", dataTotal);

    try {
      // TODO: Gọi API để cập nhật thông tin hộ khẩu cho nhân khẩu
      const response = await fetch(`${apiUrl}/nhankhau/add-to-hokhau`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataTotal),
      });

      const result = await response.json();
      console.log("Kết quả vào hộ khẩu:", result);

      if (result.EC === 0) {
        toast.success("Thêm vào hộ khẩu thành công!");
        setIsAddHKModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error(result.EM || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào hộ khẩu:", error);
      toast.error("Có lỗi xảy ra khi thêm vào hộ khẩu!");
    }
  };

  // Hàm xử lý thêm nhân khẩu
  const handleSubmitAddNK = async (data) => {
    console.log("Dữ liệu nhân khẩu mới:", data);

    try {
      const formattedData = {
        HoTen: data.HoTen,
        BiDanh: data.BiDanh,
        GioiTinh: data.GioiTinh === "Nam" ? true : false,
        NgaySinh: data.NgaySinh,
        NoiSinh: data.NoiSinh,
        NguyenQuan: data.NguyenQuan,
        DanToc: data.DanToc,
        NgheNghiep: data.NgheNghiep,
        NoiLamViec: data.NoiLamViec,
        CCCD: data.CCCD?.trim() || "",
        NgayCapCCCD: data.NgayCapCCCD,
        NoiCapCCCD: data.NoiCapCCCD,
        NgayDangKyThuongTru: data.NgayDangKyThuongTru,
        DiaChiCu: data.DiaChiCu,
        GhiChu: data.GhiChu,
        TrangThai: data.TrangThai.replace(/\s+/g, "_").toUpperCase(),
        SoHoKhau: data.SoHoKhau?.trim() || "",
        QuanHeVoiChuHo: data.QuanHeVoiChuHo,
      };

      const response = await fetch(`${apiUrl}/nhankhau/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();
      console.log("Kết quả thêm nhân khẩu:", result);

      if (result.EC === 0) {
        toast.success("Thêm nhân khẩu thành công!");
        setIsAddModalOpen(false);
        fetchUsers();
      } else {
        toast.error(result.EM || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm nhân khẩu:", error);
      toast.error("Có lỗi xảy ra khi thêm nhân khẩu!");
    }
  };

  // Hàm chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const genderMap = (gender) => {
    if (gender) return "Nam";
    else return "Nữ";
  };

  // Hàm render trạng thái với màu sắc
  const renderTrangThai = (trangThai) => {
    let className = "status-badge";
    let text = trangThai;

    switch (trangThai) {
      case "O_HO_KHAU":
        className += " status-o-ho-khau";
        text = "Ở hộ khẩu";
        break;
      case "DA_QUA_DOI":
        className += " status-da-qua-doi";
        text = "Đã qua đời";
        break;
      case "CHUYEN_HO_KHAU":
        className += " status-chuyen-ho-khau";
        text = "Chuyển hộ khẩu";
        break;
      default:
        className += " status-default";
    }

    return <span className={className}>{text}</span>;
  };

  return (
    <div className="hk-table-container">
      <div className="hk-header">
        <h3>Danh sách nhân khẩu</h3>
        <div className="hk-header-actions">
          <input
            type="text"
            placeholder="Tìm theo các cột"
            value={search}
            onChange={(e) => handleSearchChange(e)}
          />
          <button className="add-btn" onClick={handleAddHK}>
            + Thêm nhân khẩu
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nhân khẩu id</th>
            <th>Họ tên</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>CCCD</th>
            <th>Số Hộ Khẩu</th>
            <th>Quan hệ chủ hộ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
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
            filteredUsers.map((user, index) => (
              <tr key={user?.HoKhauId}>
                <td>{user?.NhanKhauId}</td>
                <td>{user?.HoTen}</td>
                <td>{genderMap(user?.GioiTinh)}</td>
                <td>{formattedDate(user?.NgaySinh)}</td>
                <td>{user?.CCCD}</td>
                <td>{user?.SoHoKhau}</td>
                <td>{user?.QuanHeVoiChuHo}</td>
                <td>{renderTrangThai(user?.TrangThai)}</td>

                <td>
                  {user?.TrangThai === "O_HO_KHAU" && (
                    <button
                      className="view-btn btn-warning"
                      onClick={() => handleOpenChuyenModal(user)}
                    >
                      Chuyển/Qua đời
                    </button>
                  )}
                  {user?.TrangThai === "CHUYEN_HO_KHAU" && (
                    <button
                      className="view-btn btn-success"
                      onClick={() => handleOpenAddHKModal(user)}
                    >
                      Vào hộ khẩu
                    </button>
                  )}
                  {user?.TrangThai === "DA_QUA_DOI" && (
                    <span style={{ color: "#9ca3af" }}>—</span>
                  )}
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

      {/* Modal Thêm Nhân Khẩu */}
      <AddNK
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmitAddNK}
      />

      {/* Modal Chuyển/Qua Đời */}
      <ModalChuyenOrQuaDoi
        isOpen={isChuyenModalOpen}
        onClose={() => {
          setIsChuyenModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSubmitChuyenOrQuaDoi}
        currentUser={selectedUser}
      />

      {/* Modal Vào Hộ Khẩu */}
      <ModalAddHK
        isOpen={isAddHKModalOpen}
        onClose={() => {
          setIsAddHKModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSubmitAddHK}
        currentUser={selectedUser}
      />
    </div>
  );
};
export default NhanKhau;
