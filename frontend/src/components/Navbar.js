import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ✦ SocialApp
      </Link>

      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <div className="navbar-user">
              <Avatar username={user?.username} size={32} />
              <span style={{ fontWeight: 600 }}>@{user?.username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                padding: "8px 18px",
                border: "1.5px solid var(--color-border)",
                borderRadius: "var(--radius-full)",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                transition: "all 0.2s",
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                padding: "8px 18px",
                background: "var(--color-primary)",
                borderRadius: "var(--radius-full)",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "white",
                transition: "all 0.2s",
              }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
