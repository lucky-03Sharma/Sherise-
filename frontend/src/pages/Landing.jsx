import { Link } from "react-router-dom";
import "../css/Landing.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="landing">

      {/* Navbar */}

      {/* Navbar */}

<nav className="navbar">

  <h2 className="logo">SheRise</h2>

  <div
    className="menu-icon"
    onClick={() => setIsMenuOpen(!isMenuOpen)}
  >
    <FontAwesomeIcon icon={faBars} size="2x" />
  </div>

  {isMenuOpen && (

    <div className="dropdown-menu">

      <Link to="/">Home</Link>

      <a href="#services">Services</a>

      <a href="#why">Why Us</a>

      <Link to="/login">Login</Link>

      <Link to="/register">Register</Link>

    </div>

  )}

</nav>

      {/* Hero */}

      <section className="hero">

        <div className="hero-text">

          <h1>Your Voice. Your Strength. Your Safety.</h1>

          <p className="hero-subtitle">
            SheRise is a secure platform that empowers women
            through legal guidance, complaint registration,
            therapy support and emergency assistance.
          </p>

          <div className="hero-buttons">

            <Link to="/register">
              <button className="primary-btn">
                Get Started
              </button>
            </Link>

            <Link to="/login">
              <button className="secondary-btn">
                Login
              </button>
            </Link>

          </div>

        </div>

      </section>

      {/* Services */}

      <section className="services" id="services">

        <h2>Our Services</h2>

        <div className="cards">

          <div className="card">
            <h3> Complaint Portal</h3>

            <p>
              Report complaints securely and
              track their progress online.
            </p>
          </div>

          <div className="card">
            <h3>Legal Consultation</h3>

            <p>
              Get professional legal guidance
              whenever you need it.
            </p>
          </div>

          <div className="card">
            <h3>Therapy Support</h3>

            <p>
              Access counseling and therapy
              sessions confidentially.
            </p>
          </div>

          <div className="card">
            <h3>Emergency Helplines</h3>

            <p>
              Find important emergency
              contacts instantly.
            </p>
          </div>

        </div>

      </section>

      {/* Why Us */}

      <section className="why" id="why">

        <h2>Why Choose SheRise?</h2>

        <div className="cards">

          <div className="card">
            <h3>Privacy First</h3>
            <p>Your information stays protected.</p>
          </div>

          <div className="card">
            <h3>Quick Support</h3>
            <p>Fast access to emergency services.</p>
          </div>

          <div className="card">
            <h3>Trusted Experts</h3>
            <p>Verified legal and therapy support.</p>
          </div>

          <div className="card">
            <h3>Empowerment</h3>
            <p>Helping women build a safer future.</p>
          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="cta">

        <h2>Ready to Take the First Step?</h2>

        <p>
          Join SheRise today and access support whenever you need it.
        </p>

        <Link to="/register">
          <button className="primary-btn">
            Register Now
          </button>
        </Link>

      </section>

      {/* Footer */}

      <footer>

        <h2>SheRise</h2>

        <p>Your Voice. Your Strength. Your Safety.</p>

        <p>© 2026 SheRise. All Rights Reserved.</p>

      </footer>

    </div>
  );
}