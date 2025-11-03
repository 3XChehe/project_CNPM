import React, { useState, useEffect } from "react";
import { formattedDate } from "../../../helper";
import "./XemNK.scss";

const XemNK = ({ isOpen, onClose, hoKhauData }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState(null);
  const [chuho, setChuHo] = useState(null);
  const [diachi, setDiaChi] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/hokhau/detail-nk/${hoKhauData.HoKhauId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Fetch chi tiet nhan khau response:", data.DT);
      const diachi = `${data.DT.SoNha},${data.DT.DuongPho},${data.DT.Phuong}, ${data.DT.Quan}`;
      const nhankhau = data.DT.nhankhau || [];
      const tableTotal = nhankhau.length;
      if (data.EC === 0) {
        setUsers(nhankhau || []);
        setChuHo(data.DT.ChuHoKhau.NhanKhau || {});
        setDiaChi(diachi);
        setTotal(tableTotal);
      } else {
        console.log(data.EM);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const genderMap = (gender) => {
    if (gender) return "Nam";
    else return "Nữ";
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, hoKhauData]);

  if (!isOpen) return null;

  const data = users;

  return (
    <div className="xem-nk-overlay" onClick={onClose}>
      <div className="xem-nk-modal" onClick={(e) => e.stopPropagation()}>
        <div className="xem-nk-header">
          <h2>Chi Tiết Hộ Khẩu</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="xem-nk-content">
          <div className="ho-khau-info">
            <div className="info-row">
              <span className="label">Mã hộ khẩu:</span>
              <span className="value">{hoKhauData?.SoHoKhau}</span>
            </div>
            <div className="info-row">
              <span className="label">Chủ hộ:</span>
              <span className="value">{chuho?.HoTen}</span>
            </div>
            <div className="info-row">
              <span className="label">Địa chỉ:</span>
              <span className="value">{diachi}</span>
            </div>
          </div>

          <div className="nhan-khau-section">
            <h3>Danh sách nhân khẩu ({0 || total} người)</h3>
            <div className="nhan-khau-table">
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ và tên</th>
                    <th>Năm sinh</th>
                    <th>Giới tính</th>
                    <th>Quan hệ với chủ hộ</th>
                    <th>CCCD</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data.map((nhanKhau, index) => (
                      <tr key={nhanKhau.id || index}>
                        <td>{index + 1}</td>
                        <td>{nhanKhau.HoTen}</td>
                        <td>{formattedDate(nhanKhau.NgaySinh)}</td>
                        <td>{genderMap(nhanKhau.GioiTinh)}</td>
                        <td>{nhanKhau.QuanHeVoiChuHo}</td>
                        <td>{nhanKhau.CCCD}</td>
                        <td>{nhanKhau.GhiChu}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        Không có dữ liệu nhân khẩu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xem-nk-footer">
          <button className="btn-close" onClick={onClose}>
            <p className="text-close">Đóng</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default XemNK;
