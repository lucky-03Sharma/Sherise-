import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneVolume,
  faShieldHeart,
  faTowerBroadcast,
  faXmark,
  faLocationDot,
  faBuildingShield,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { triggerOneTapSOS } from "../services/sosService";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/sos-button.css";

export default function SOSButton() {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("");
  const [countdown, setCountdown] = useState(null);
  const countdownIntervalRef = useRef(null);

  // Shake detection on mobile (3 rapid shakes triggers SOS)
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeCount = 0;
    let lastTime = 0;

    const handleMotion = (event) => {
      const current = event.accelerationIncludingGravity;
      if (!current) return;

      const currentTime = Date.now();
      if (currentTime - lastTime > 100) {
        const diffTime = currentTime - lastTime;
        lastTime = currentTime;

        const speed =
          (Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) /
            diffTime) *
          10000;

        if (speed > 800) {
          shakeCount += 1;
          if (shakeCount >= 4) {
            shakeCount = 0;
            handleTrigger("support");
          }
        } else if (currentTime - lastTime > 1500) {
          shakeCount = 0;
        }

        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleMotion, false);
    }
    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener("devicemotion", handleMotion, false);
      }
    };
  }, []);

  const handleTrigger = async (target = "support") => {
    setLoading(true);
    setActiveStatus(t("Locating nearest responder and sharing live GPS..."));

    try {
      const result = await triggerOneTapSOS(target);
      const responderName = result.responder?.name || "Emergency Services";
      setActiveStatus(
        `${t("Connected to")} ${responderName}! ${t("Live GPS active.")}`
      );
      setTimeout(() => {
        setModalOpen(false);
        setActiveStatus("");
      }, 4000);
    } catch (err) {
      console.error("SOS trigger error:", err);
      setActiveStatus(
        err.response?.data?.message ||
          t("SOS Alert triggered. Opening dialer to 112.")
      );
      window.location.href = "tel:112";
    } finally {
      setLoading(false);
      setCountdown(null);
    }
  };

  const startAutoSOS = (target = "support") => {
    setCountdown(3);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          handleTrigger(target);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setCountdown(null);
    setActiveStatus("");
  };

  return (
    <>
      {/* Persistent Floating SOS Button */}
      <div className="sos-floating-container">
        <button
          type="button"
          className="sos-main-trigger-btn"
          onClick={() => setModalOpen(true)}
          title="Emergency SOS — Connect to Nearest Responder"
          aria-label="Emergency SOS"
        >
          <span className="sos-pulse-ring"></span>
          <span className="sos-pulse-ring-2"></span>
          <span className="sos-btn-content">
            <FontAwesomeIcon icon={faTowerBroadcast} className="sos-tower-icon" />
            <span className="sos-text">SOS</span>
          </span>
        </button>
      </div>

      {/* SOS Action Modal */}
      {modalOpen && (
        <div className="sos-modal-backdrop" onClick={() => !loading && setModalOpen(false)}>
          <div className="sos-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sos-modal-header">
              <div className="sos-modal-title-group">
                <span className="sos-badge-urgent">
                  <FontAwesomeIcon icon={faLocationDot} /> LIVE GPS ACTIVE
                </span>
                <h3>{t("Emergency SOS Support")}</h3>
                <p className="sos-subtitle">
                  {t("Connects instantly to nearest police station, SheRise member, or helpline.")}
                </p>
              </div>
              <button
                type="button"
                className="sos-close-btn"
                onClick={() => {
                  cancelCountdown();
                  setModalOpen(false);
                }}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {countdown !== null ? (
              <div className="sos-countdown-banner">
                <div className="sos-countdown-circle">{countdown}</div>
                <div>
                  <h5>{t("Calling Nearest Responder...")}</h5>
                  <p>{t("Sharing your exact live location.")}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={cancelCountdown}
                >
                  {t("Cancel")}
                </button>
              </div>
            ) : (
              activeStatus && (
                <div className="sos-status-alert">
                  <FontAwesomeIcon icon={faSpinner} spin={loading} />
                  <span>{activeStatus}</span>
                </div>
              )
            )}

            <div className="sos-actions-list">
              {/* Option 1: Nearest Any Responder */}
              <button
                type="button"
                className="sos-action-card sos-primary-action"
                onClick={() => handleTrigger("support")}
                disabled={loading}
              >
                <div className="sos-action-icon bg-red">
                  <FontAwesomeIcon icon={faPhoneVolume} />
                </div>
                <div className="sos-action-info">
                  <h4>{t("Connect Nearest Support (Auto-Detect)")}</h4>
                  <p>{t("Auto-connects to closest Police, SheRise member or 112 with GPS")}</p>
                </div>
                <span className="sos-instant-badge">{t("Recommended")}</span>
              </button>

              {/* Option 2: Nearest Police */}
              <button
                type="button"
                className="sos-action-card"
                onClick={() => handleTrigger("police")}
                disabled={loading}
              >
                <div className="sos-action-icon bg-blue">
                  <FontAwesomeIcon icon={faBuildingShield} />
                </div>
                <div className="sos-action-info">
                  <h4>{t("Nearest Police Station")}</h4>
                  <p>{t("Immediate dispatch with live GPS coordinate sharing")}</p>
                </div>
              </button>

              {/* Option 3: Nearest SheRise Member */}
              <button
                type="button"
                className="sos-action-card"
                onClick={() => handleTrigger("sherise")}
                disabled={loading}
              >
                <div className="sos-action-icon bg-purple">
                  <FontAwesomeIcon icon={faShieldHeart} />
                </div>
                <div className="sos-action-info">
                  <h4>{t("Nearest SheRise Member")}</h4>
                  <p>{t("Contact local verified SheRise community support network")}</p>
                </div>
              </button>
            </div>

            <div className="sos-modal-footer">
              <small>
                💡 <strong>Tip:</strong> You can also shake your phone rapidly 4 times to trigger SOS without opening the menu.
              </small>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
