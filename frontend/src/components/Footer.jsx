import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import SheRiseLogo from "./SheRiseLogo";
import "../css/Footer.css";

const socialLinks = [
  {
    icon: faFacebook,
    label: "Facebook",
    href: "https://www.facebook.com/sherise",
  },
  {
    icon: faInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/sherise",
  },
  {
    icon: faXTwitter,
    label: "Twitter",
    href: "https://twitter.com/sherise",
  },
  {
    icon: faLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/sherise",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <SheRiseLogo linked={false} size="footer" />

      <p className="site-footer-tagline">
        Your Voice. Your Strength. Your Safety.
      </p>

      <div className="site-footer-social">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`SheRise on ${link.label}`}
          >
            <FontAwesomeIcon icon={link.icon} />
          </a>
        ))}
      </div>

      <p className="site-footer-copy">
        &copy; {year} SheRise. All Rights Reserved.
      </p>
    </footer>
  );
}
