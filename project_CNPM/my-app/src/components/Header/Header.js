import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Load user từ localStorage
    const raw = localStorage.getItem("user");
    const parsed = raw && raw !== "null" ? JSON.parse(raw) : null;
    setUser(parsed);

    const handleUserChange = () => {
      const raw = localStorage.getItem("user");
      const parsed = raw && raw !== "null" ? JSON.parse(raw) : null;
      setUser(parsed);
    };

    window.addEventListener("userChanged", handleUserChange);
    return () => window.removeEventListener("userChanged", handleUserChange);
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("userChanged"));
      alert("Đăng xuất thành công!");
    } catch (e) {
      console.error("Error clearing user from localStorage", e);
    }
    setUser(null);
    navigate("/dangnhap");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <NavLink to={`/`} className="navbar-brand">
          Quản lí dân dư
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to={`/`} className="nav-link">
              Trang chủ
            </NavLink>
            {user && ["TT", "TP", "CB_HKNK"].includes(user.ChucVu) && (
              <NavLink to={`/hokhau`} className="nav-link">
                Hộ khẩu
              </NavLink>
            )}
            {user && ["TT", "TP", "CB_HKNK"].includes(user.ChucVu) && (
              <NavLink to={`/nhankhau`} className="nav-link">
                Nhân khẩu
              </NavLink>
            )}
            <NavLink to={`/phananh`} className="nav-link">
              Phản ánh
            </NavLink>
            {user && ["TT", "TP", "CB_HKNK"].includes(user.ChucVu) && (
              <NavLink to={`/tvtt`} className="nav-link">
                TVTT
              </NavLink>
            )}
            {user && user.ChucVu === "TT" && (
              <NavLink to={`/nhansu`} className="nav-link">
                Nhân sự
              </NavLink>
            )}
            {/* <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="user">User</Nav.Link>
                        <Nav.Link href="admin">Admin</Nav.Link> */}
          </Nav>
          <Nav>
            {!user ? (
              <>
                <button className="btn-signup">Đăng nhập</button>
              </>
            ) : (
              <button
                className="btn-logout"
                onClick={handleLogout}
                style={{
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                Đăng xuất
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
