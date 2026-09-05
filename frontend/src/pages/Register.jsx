import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
  faCircleExclamation,
  faCircleCheck,
  faShieldHeart,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import API from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import Navbar from "../components/Navbar";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/Register.css";

export default function Register() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!name || !email || !password) {
      setMessage("Please fill in all required fields.");
      setIsSuccess(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setIsSuccess(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please verify and try again.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/register", { name, email, password });

      setIsSuccess(true);
      setMessage("Account created successfully!");

      // If backend returned token, auto-login directly!
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        if (res.data.name || name) {
          localStorage.setItem("name", res.data.name || name);
        }
        if (res.data.email || email) {
          localStorage.setItem("email", res.data.email || email);
        }

        setTimeout(() => {
          navigate("/dashboard");
        }, 600);
      } else {
        // Fallback: redirect to login with pre-filled email
        setTimeout(() => {
          navigate("/login", {
            state: {
              email,
              message: "Account created successfully! Please sign in.",
            },
          });
        }, 1000);
      }
    } catch (err) {
      console.error("Register error:", err);
      setIsSuccess(false);
      setMessage(
        getApiErrorMessage(err, "Registration failed. Please try again.")
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
              <h1 className="auth-title">{t("Create Your Account")}</h1>
              <p className="auth-subtitle">
                {t("Join SheRise for confidential support, therapy, and emergency safety")}
              </p>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="auth-tabs">
              <Link to="/login" className="auth-tab" aria-selected="false">
                {t("Sign In")}
              </Link>
              <button
                type="button"
                className="auth-tab active"
                aria-selected="true"
              >
                {t("Create Account")}
              </button>
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

            {/* Register Form */}
            <form onSubmit={handleRegister} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="reg-name">{t("Full Name")}</label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  <input
                    id="reg-name"
                    type="text"
                    className="auth-input"
                    placeholder={t("Your name or preferred alias")}
                    value={form.name}
                    disabled={loading}
                    autoComplete="name"
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">{t("Email Address")}</label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                  <input
                    id="reg-email"
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
                  <label htmlFor="reg-password">{t("Password")}</label>
                  <span className="field-hint">Min. 6 characters</span>
                </div>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder={t("Create a secure password")}
                    value={form.password}
                    disabled={loading}
                    autoComplete="new-password"
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

              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="reg-confirm-password">
                    {t("Confirm Password")}
                  </label>
                  {passwordsMatch && (
                    <span className="match-status match-success">
                      <FontAwesomeIcon icon={faCheck} /> Passwords match
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="match-status match-error">
                      Passwords do not match
                    </span>
                  )}
                </div>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`auth-input ${
                      passwordsMismatch ? "input-border-error" : ""
                    } ${passwordsMatch ? "input-border-success" : ""}`}
                    placeholder={t("Re-enter your password")}
                    value={form.confirmPassword}
                    disabled={loading}
                    autoComplete="new-password"
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    tabIndex="-1"
                    title={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
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
                    <span>{t("Creating Account...")}</span>
                  </>
                ) : (
                  <span>{t("Create Account")}</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="auth-footer">
              <p>
                {t("Already have an account?")}{" "}
                <Link to="/login" className="auth-link-bold">
                  {t("Sign in here")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
