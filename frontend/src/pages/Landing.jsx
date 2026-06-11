import { Link } from "react-router-dom";
import "../css/Landing.css";

export default function Landing() {
  return (
    <div className="landing">

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo"> SheRise</h2>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">Why Us ? </a>

          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>

          <Link to="/register">
            <button className="register-btn">Register</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}

      <section className="hero">

        <h1>Empowering Women Through Technology</h1>

        <p>
          A secure platform for complaint registration,
          legal consultation, therapy support, and
          emergency helplines.
        </p>

        <div className="hero-buttons">
          <Link to="/register">
            <button>Get Started</button>
          </Link>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>

      </section>

      {/* Features */}

      <section className="features" id="features">

        <h2>Our Services</h2>

        <div className="cards">

          <div className="card">
            <h3> Complaint Portal</h3>
            <p>
              Register complaints securely and track their status.
            </p>
          </div>

          <div className="card">
            <h3> Legal Consultation</h3>
            <p>
              Connect with legal professionals for guidance.
            </p>
          </div>

          <div className="card">
            <h3> Therapy Support</h3>
            <p>
              Book therapy and counseling sessions online.
            </p>
          </div>

          <div className="card">
            <h3> Emergency Helplines</h3>
            <p>
              Access important helpline numbers instantly.
            </p>
          </div>

        </div>

      </section>

      {/* Why Choose Us */}

      <section className="about" id="about">

        <h2>Why Choose SheRise?</h2>

        <ul>
          <li>Secure & Private</li>
          <li>Trusted Legal & Therapy Support</li>
          <li>Fast Access to Emergency Help</li>
          <li>Empowering Women Together</li>
        </ul>

      </section>

      {/* CTA */}

      <section className="cta">

        <h2>Ready to Take the First Step?</h2>

        <p>
          Join SheRise today and access support whenever you need it.
        </p>

        <Link to="/register">
          <button>Register Now</button>
        </Link>

      </section>

      {/* Footer */}

      <footer className="footer">

        <h3>SheRise</h3>

        <p>Empowering Women Through Technology</p>

        <p>© 2026 SheRise. All Rights Reserved.</p>

      </footer>

    </div>
  );
}