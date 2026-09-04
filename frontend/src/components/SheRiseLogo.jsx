import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonDress } from "@fortawesome/free-solid-svg-icons";
import "../css/SheRiseLogo.css";

export default function SheRiseLogo({ linked = true, size = "default" }) {
  const content = (
    <>
      <span className="sherise-logo-mark" aria-hidden="true">
        <FontAwesomeIcon icon={faPersonDress} />
      </span>
      <div className="sherise-logo-text-group">
        <span className="sherise-logo-text">SheRise</span>
        <span className="sherise-logo-tagline">Empower & Protect</span>
      </div>
    </>
  );

  if (linked) {
    return (
      <Link to="/" className={`sherise-logo sherise-logo--${size}`} aria-label="SheRise home">
        {content}
      </Link>
    );
  }

  return <div className={`sherise-logo sherise-logo--${size}`}>{content}</div>;
}
