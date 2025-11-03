import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const TTRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${apiUrl}/auth/profile`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.EC === 0) {
          // Lưu thông tin user vào localStorage
          localStorage.setItem("user", JSON.stringify(data.DT.user));

          // Kiểm tra quyền truy cập - Chỉ cho phép ChucVu = "TT"
          if (data.DT.user && data.DT.user.ChucVu === "TT") {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          localStorage.setItem("user", JSON.stringify(null));
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("AdminRoute - Auth check error:", error);
        localStorage.setItem("user", JSON.stringify(null));
        setIsAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [apiUrl]);

  if (checking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#667eea",
        }}
      >
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#e74c3c",
        }}
      >
        <h3>Không có quyền truy cập</h3>
        <p>Bạn cần có chức vụ "TT" để truy cập trang này.</p>
        <button
          onClick={() => window.history.back()}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#667eea",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Quay lại
        </button>
      </div>
    );
  }

  return children;
};

export default TTRoute;
