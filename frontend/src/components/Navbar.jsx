import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SheRiseLogo from "./SheRiseLogo";
import "../css/Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <SheRiseLogo />

      <div className="navbar-actions">
        <div
          className="menu-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          role="button"
          tabIndex={0}
          aria-label="Open menu"
          onKeyDown={(e) => e.key === "Enter" && setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} size="2x" />
        </div>

        {isMenuOpen && (
          <div className="sherise-dropdown">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>

            {!token ? (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/complaints" onClick={() => setIsMenuOpen(false)}>Complaints</Link>
                <Link to="/therapy" onClick={() => setIsMenuOpen(false)}>Therapy</Link>
                <Link to="/consultation" onClick={() => setIsMenuOpen(false)}>Consultation</Link>
                <Link to="/helplines" onClick={() => setIsMenuOpen(false)}>Helplines</Link>
                <button className="logout-btn" onClick={logout}>Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
