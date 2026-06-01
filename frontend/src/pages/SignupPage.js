import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../api";
import { useAuth } from "../context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "Must be at least 3 characters";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = "Only letters, numbers, underscores";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
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
      const { data } = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(data.user, data.token);
      toast.success(`Welcome to SocialApp, @${data.user.username}! 🎉`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>✦ SocialApp</h1>
          <p>Join the community today</p>
        </div>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 24 }}>
          Create your account
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username || "Letters, numbers, underscores only"}
            margin="normal"
            size="small"
            inputProps={{ maxLength: 20 }}
            sx={{ mb: 1 }}
          />

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
            sx={{ mb: 1 }}
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
            sx={{ mb: 1 }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            error={!!errors.confirm}
            helperText={errors.confirm}
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
            {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
          </Button>
        </form>

        <div className="auth-divider">or</div>

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
