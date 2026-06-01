import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../api";
import { useAuth } from "../context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.user, data.token);
      toast.success(`Welcome back, @${data.user.username}! 👋`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>✦ SocialApp</h1>
          <p>Connect, share, and engage</p>
        </div>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 24 }}>
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            size="small"
            sx={{ mb: 1.5 }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            size="small"
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.4,
              borderRadius: "var(--radius-full)",
              background: "var(--color-primary)",
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              boxShadow: "none",
              "&:hover": {
                background: "var(--color-primary-dark)",
                boxShadow: "0 4px 12px rgba(108,99,255,0.35)",
              },
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
          </Button>
        </form>

        <div className="auth-divider">or</div>

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
