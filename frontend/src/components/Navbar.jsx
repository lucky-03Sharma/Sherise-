import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">

      <h2 className="logo">SheRise</h2>

      <div
        className="menu-icon"
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </div>

      {open && (
        <div className="dropdown-menu">

          <button onClick={() => navigate("/")}>
            Home
          </button>

          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/complaints")}>
            Complaints
          </button>

          <button onClick={() => navigate("/therapy")}>
            Therapy
          </button>

          <button onClick={() => navigate("/consultation")}>
            Consultation
          </button>

          <button onClick={() => navigate("/helplines")}>
            Helplines
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      )}

    </nav>
  );
}