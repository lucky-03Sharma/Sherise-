import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faHouse,
  faClipboardList,
  faPhoneVolume,
  faHeartPulse,
  faComments,
  faRightFromBracket,
  faUser,
  faTowerBroadcast,
  faShieldHeart,
} from "@fortawesome/free-solid-svg-icons";
import SheRiseLogo from "./SheRiseLogo";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/Navbar.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name") || "Friend";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: t("Home"), icon: faHouse },
    ...(token
      ? [
          { to: "/dashboard", label: t("Dashboard"), icon: faShieldHeart },
          { to: "/complaints", label: t("Complaints"), icon: faClipboardList },
          { to: "/helplines", label: t("Helplines"), icon: faPhoneVolume },
          { to: "/therapy", label: t("Therapy"), icon: faHeartPulse },
          { to: "/consultation", label: t("Consultation"), icon: faComments },
        ]
      : [
          { to: "/complaints", label: t("Complaints"), icon: faClipboardList },
          { to: "/helplines", label: t("Helplines"), icon: faPhoneVolume },
        ]),
  ];

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand-col">
          <SheRiseLogo />
        </div>

        {/* Center Desktop Navigation Links */}
        <div className="navbar-links-desktop">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`desktop-nav-link ${isActive ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={link.icon} className="nav-link-icon" />
                <span>{link.label}</span>
                {isActive && <span className="nav-link-indicator"></span>}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Quick SOS, Language Selector, User Profile / Auth buttons */}
        <div className="navbar-right-actions">
          {/* Quick Emergency 112 Dial Pill */}
          <a
            href="tel:112"
            className="navbar-quick-sos-pill"
            title="Emergency 112 Helpline"
          >
            <span className="sos-dot-live"></span>
            <FontAwesomeIcon icon={faTowerBroadcast} />
            <span className="sos-pill-label">112 SOS</span>
          </a>

          {/* Sarvam AI Multilingual Selector */}
          <LanguageSelector />

          {/* Auth State Links */}
          {token ? (
            <div className="navbar-user-section">
              <Link to="/dashboard" className="user-profile-badge" title="My Dashboard">
                <span className="user-avatar-circle">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <span className="user-name-text">{userName.split(" ")[0]}</span>
              </Link>
              <button
                type="button"
                className="btn-navbar-logout"
                onClick={logout}
                title="Log out"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span className="logout-text">{t("Logout")}</span>
              </button>
            </div>
          ) : (
            <div className="navbar-guest-actions">
              <Link to="/login" className="btn-navbar-login">
                {t("Login")}
              </Link>
              <Link to="/register" className="btn-navbar-register">
                {t("Register")}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle (only on small screens) */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} size="lg" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          <div className="mobile-drawer-inner">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`mobile-nav-item ${isActive ? "active" : ""}`}
                >
                  <FontAwesomeIcon icon={link.icon} className="mobile-nav-icon" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <hr className="mobile-divider" />

            {token ? (
              <div className="mobile-user-actions">
                <div className="mobile-user-info">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{t("Signed in as")} <strong>{userName}</strong></span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger w-100 mt-2"
                  onClick={logout}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} /> {t("Logout")}
                </button>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="btn btn-outline-secondary w-100 mb-2">
                  {t("Login")}
                </Link>
                <Link to="/register" className="btn btn-primary w-100">
                  {t("Register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
