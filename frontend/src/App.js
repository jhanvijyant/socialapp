import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import FeedPage from "./pages/FeedPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import "./styles/global.css";

// ─── Route Guards ─────────────────────────────────────────────────
const GuestRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

// ─── App Layout ───────────────────────────────────────────────────
const AppLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <Routes>
        {/* Public feed */}
        <Route path="/" element={<FeedPage />} />

        {/* Auth pages — redirect to home if already logged in */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────
const App = () => (
  <AuthProvider>
    <Router>
      <AppLayout />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastStyle={{
          fontFamily: "var(--font-body)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
        }}
      />
    </Router>
  </AuthProvider>
);

export default App;
