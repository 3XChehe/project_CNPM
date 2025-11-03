import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
          setIsAuthenticated(true);
        } else {
          localStorage.setItem("user", JSON.stringify(null));
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("ProtectedRoute - Auth check error:", error);
        localStorage.setItem("user", JSON.stringify(null));
        setIsAuthenticated(false);
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

  return isAuthenticated ? children : <Navigate to="/dangnhap" replace />;
};

export default ProtectedRoute;
