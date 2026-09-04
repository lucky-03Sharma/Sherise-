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
  faArrowRight,
  faPersonDress,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IconCircle from "../components/IconCircle";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/Landing.css";

export default function Landing() {
  const { t } = useLanguage();

  const services = [
    {
      icon: faClipboardList,
      title: t("Complaint Portal"),
      text: t("Report complaints securely with AI priority detection and live tracking."),
    },
    {
      icon: faScaleBalanced,
      title: t("Legal Consultation"),
      text: t("Get professional legal guidance whenever you need it."),
    },
    {
      icon: faUserDoctor,
      title: t("Therapy Support"),
      text: t("Access counseling and therapy sessions confidentially."),
    },
    {
      icon: faPhoneVolume,
      title: t("Emergency Helplines"),
      text: t("Instant access to nearest police, SheRise members, and 112 SOS."),
    },
  ];

  const whyUs = [
    {
      icon: faShieldHalved,
      title: t("Privacy First"),
      text: t("Your identity and reports remain encrypted and secure."),
    },
    {
      icon: faBolt,
      title: t("Quick Support"),
      text: t("AI severity prioritization and instant 1-tap SOS connection."),
    },
    {
      icon: faUserCheck,
      title: t("Trusted Experts"),
      text: t("Verified psychologists, lawyers, and community responders."),
    },
    {
      icon: faHeart,
      title: t("Empowerment"),
      text: t("Helping women build a safer, confident future together."),
    },
  ];

  return (
    <div className="landing">
      <Navbar />

      <section className="hero">
        <div className="hero-text">
          <div className="hero-badge">
            <FontAwesomeIcon icon={faPersonDress} />
            <span>{t("Dedicated Safety & Wellness Ecosystem")}</span>
          </div>

          <h1>{t("Your Voice. Your Strength. Your Safety.")}</h1>

          <p className="hero-subtitle">
            {t(
              "SheRise provides a confidential haven for women to report incidents, access certified mental health therapy, consult legal professionals, and trigger instant emergency SOS to nearest responders."
            )}
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              <span>{t("Get Protected Now")}</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <Link to="/helplines" className="secondary-btn">
              <FontAwesomeIcon icon={faPhoneVolume} />
              <span>{t("Emergency Helplines")}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <h2>{t("Comprehensive Support Services")}</h2>
        <div className="cards">
          {services.map((service) => (
            <div className="card" key={service.title}>
              <div className="card-icon">
                <IconCircle icon={service.icon} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="why" id="why">
        <div className="container">
          <h2>{t("Why Choose SheRise?")}</h2>
          <div className="why-grid">
            {whyUs.map((item) => (
              <div className="why-card" key={item.title}>
                <div className="card-icon">
                  <IconCircle icon={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>{t("Ready to Take the First Step?")}</h2>
        <p>{t("Join SheRise today and access support whenever you need it.")}</p>
        <Link to="/register" className="cta-btn">
          <span>{t("Register Now")}</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
