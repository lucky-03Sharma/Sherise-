import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
  faCircleExclamation,
  faCircleCheck,
  faShieldHeart,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import API from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import Navbar from "../components/Navbar";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/login.css";

export default function Login() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: location.state?.email || "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(location.state?.message || "");
  const [isSuccess, setIsSuccess] = useState(
    location.state?.message?.toLowerCase().includes("success") || false
  );
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setMessage("Please enter both your email and password.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.name) {
        localStorage.setItem("name", res.data.name);
      }
      if (res.data.email) {
        localStorage.setItem("email", res.data.email);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setIsSuccess(false);
      setMessage(
        getApiErrorMessage(
          err,
          "Invalid email or password. Please check your credentials and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            {/* Header / Brand */}
            <div className="auth-header">
              <div className="auth-icon-badge">
                <FontAwesomeIcon icon={faShieldHeart} />
              </div>
              <h1 className="auth-title">{t("Welcome Back")}</h1>
              <p className="auth-subtitle">
                {t("Access your safe and confidential SheRise account")}
              </p>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="auth-tabs">
              <button
                type="button"
                className="auth-tab active"
                aria-selected="true"
              >
                {t("Sign In")}
              </button>
              <Link
                to="/register"
                className="auth-tab"
                aria-selected="false"
              >
                {t("Create Account")}
              </Link>
            </div>

            {/* Alert Message */}
            {message && (
              <div
                className={`auth-alert ${
                  isSuccess ? "auth-alert-success" : "auth-alert-error"
                }`}
              >
                <div className="auth-alert-content">
                  <FontAwesomeIcon
                    icon={isSuccess ? faCircleCheck : faCircleExclamation}
                    className="auth-alert-icon"
                  />
                  <span>{message}</span>
                </div>
                <button
                  type="button"
                  className="auth-alert-dismiss"
                  onClick={() => setMessage("")}
                  aria-label="Dismiss alert"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="login-email">{t("Email Address")}</label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    className="auth-input"
                    placeholder="name@example.com"
                    value={form.email}
                    disabled={loading}
                    autoComplete="email"
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="login-password">{t("Password")}</label>
                </div>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder={t("Enter your password")}
                    value={form.password}
                    disabled={loading}
                    autoComplete="current-password"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="btn-spinner" />
                    <span>{t("Signing In...")}</span>
                  </>
                ) : (
                  <span>{t("Sign In")}</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="auth-footer">
              <p>
                {t("Don't have an account?")}{" "}
                <Link to="/register" className="auth-link-bold">
                  {t("Register here")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
