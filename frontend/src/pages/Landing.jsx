import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faClipboardList,
  faHeart,
  faPhoneVolume,
  faScaleBalanced,
  faShieldHalved,
  faUserCheck,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IconCircle from "../components/IconCircle";
import "../css/Landing.css";

const services = [
  {
    icon: faClipboardList,
    title: "Complaint Portal",
    text: "Report complaints securely and track their progress online.",
  },
  {
    icon: faScaleBalanced,
    title: "Legal Consultation",
    text: "Get professional legal guidance whenever you need it.",
  },
  {
    icon: faUserDoctor,
    title: "Therapy Support",
    text: "Access counseling and therapy sessions confidentially.",
  },
  {
    icon: faPhoneVolume,
    title: "Emergency Helplines",
    text: "Find important emergency contacts instantly.",
  },
];

const whyUs = [
  {
    icon: faShieldHalved,
    title: "Privacy First",
    text: "Your information stays protected.",
  },
  {
    icon: faBolt,
    title: "Quick Support",
    text: "Fast access to emergency services.",
  },
  {
    icon: faUserCheck,
    title: "Trusted Experts",
    text: "Verified legal and therapy support.",
  },
  {
    icon: faHeart,
    title: "Empowerment",
    text: "Helping women build a safer future.",
  },
];

export default function Landing() {
  return (
    <div className="landing">
      <Navbar />

      <section className="hero">
        <div className="hero-text">
          <h1>Your Voice. Your Strength. Your Safety.</h1>
          <p className="hero-subtitle">
            SheRise is a secure platform that empowers women through legal
            guidance, complaint registration, therapy support and emergency
            assistance.
          </p>

          <div className="hero-buttons">
            <Link to="/register">
              <button className="primary-btn">Get Started</button>
            </Link>
            <Link to="/login">
              <button className="secondary-btn">Login</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <h2>Our Services</h2>
        <div className="cards">
          {services.map((item) => (
            <div className="card" key={item.title}>
              <IconCircle icon={item.icon} className="card-icon" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="why" id="why">
        <h2>Why Choose SheRise?</h2>
        <div className="cards">
          {whyUs.map((item) => (
            <div className="card" key={item.title}>
              <IconCircle icon={item.icon} className="card-icon card-icon--soft" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Take the First Step?</h2>
        <p>Join SheRise today and access support whenever you need it.</p>
        <Link to="/register">
          <button className="primary-btn">Register Now</button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
