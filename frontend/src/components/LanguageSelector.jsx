import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/language-selector.css";

export default function LanguageSelector() {
  const { language, setLanguage, supportedLanguages, isTranslating } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="language-selector-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`lang-btn ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        title="Select Language"
        aria-label="Change Language"
      >
        <FontAwesomeIcon icon={isTranslating ? faSpinner : faGlobe} spin={isTranslating} className="globe-icon" />
        <span className="lang-label">{currentLang.nativeName}</span>
      </button>

      {open && (
        <div className="lang-dropdown-menu">
          <div className="lang-dropdown-header">
            <span>Select Language</span>
            <span className="lang-count-badge">Multilingual</span>
          </div>
          <div className="lang-options-grid">
            {supportedLanguages.map((l) => {
              const isSelected = l.code === language;
              return (
                <button
                  key={l.code}
                  type="button"
                  className={`lang-option-item ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setLanguage(l.code);
                    setOpen(false);
                  }}
                >
                  <div className="lang-option-names">
                    <span className="lang-native">{l.nativeName}</span>
                    <span className="lang-english">{l.name}</span>
                  </div>
                  {isSelected && (
                    <FontAwesomeIcon icon={faCheck} className="lang-check-icon" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
