import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneVolume,
  faShieldHeart,
  faTowerBroadcast,
  faXmark,
  faLocationDot,
  faSpinner,
  faVolumeHigh,
  faVolumeXmark,
  faAddressBook,
  faCheck,
  faArrowUpRightFromSquare,
  faRotate,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  triggerOneTapSOS,
  getLiveCoordinates,
  startEmergencySiren,
  stopEmergencySiren,
  getStoredEmergencyContacts,
  saveStoredEmergencyContacts,
  getWhatsAppEmergencyUrl,
  getSmsEmergencyUrl,
} from "../services/sosService";
import { dialHelpline } from "../services/emergencyService";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/sos-button.css";

export default function SOSButton() {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("");
  const [coords, setCoords] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    isLive: false,
  });
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [showContactsManager, setShowContactsManager] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  // Load contacts and fetch GPS whenever modal opens
  useEffect(() => {
    if (modalOpen) {
      setContacts(getStoredEmergencyContacts());
      fetchLiveGPS();
    } else {
      // Stop siren if modal is closed
      if (sirenPlaying) {
        stopEmergencySiren();
        setSirenPlaying(false);
      }
    }
  }, [modalOpen]);

  // Clean up siren on component unmount
  useEffect(() => {
    return () => {
      stopEmergencySiren();
    };
  }, []);

  // Shake detection on mobile (4 rapid shakes triggers immediate SOS)
  useEffect(() => {
    let lastX = 0,
      lastY = 0,
      lastZ = 0;
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

        if (speed > 850) {
          shakeCount += 1;
          if (shakeCount >= 4) {
            shakeCount = 0;
            setModalOpen(true);
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

  const fetchLiveGPS = async () => {
    setActiveStatus(t("Locating high-precision GPS coordinates..."));
    const liveCoords = await getLiveCoordinates(4000);
    setCoords(liveCoords);
    if (liveCoords.isLive) {
      setActiveStatus(t("Live GPS locked."));
    } else {
      setActiveStatus(
        t("GPS unavailable or taking long — emergency dialers are ready.")
      );
    }
  };

  const handleTrigger = async (target = "support") => {
    setLoading(true);
    setActiveStatus(t("Dispatching emergency alert & dialer..."));

    try {
      const result = await triggerOneTapSOS(target);
      const responderName = result.responder?.name || "112 National Police";
      setActiveStatus(
        `${t("Alert sent! Connecting to")} ${responderName}...`
      );
    } catch (err) {
      console.warn("Backend SOS notification fallback:", err.message);
      setActiveStatus(t("Emergency call opened to 112!"));
      dialHelpline("112");
    } finally {
      setLoading(false);
    }
  };

  const toggleSiren = () => {
    if (sirenPlaying) {
      stopEmergencySiren();
      setSirenPlaying(false);
    } else {
      startEmergencySiren();
      setSirenPlaying(true);
    }
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const updated = [
      ...contacts,
      {
        id: Date.now().toString(),
        name: newContactName.trim(),
        phone: newContactPhone.trim(),
      },
    ];
    setContacts(updated);
    saveStoredEmergencyContacts(updated);
    setNewContactName("");
    setNewContactPhone("");
  };

  const handleDeleteContact = (id) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    saveStoredEmergencyContacts(updated);
  };

  const mapsUrl =
    coords.latitude && coords.longitude
      ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
      : null;

  return (
    <>
      {/* Persistent Floating SOS Button */}
      <div className="sos-floating-container">
        <button
          type="button"
          className={`sos-main-trigger-btn ${sirenPlaying ? "siren-active" : ""}`}
          onClick={() => setModalOpen(true)}
          title="Emergency SOS — Instant Police, Helplines & Live GPS"
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

      {/* Full-Featured SOS Emergency Modal */}
      {modalOpen && (
        <div
          className="sos-modal-backdrop"
          onClick={() => !loading && setModalOpen(false)}
        >
          <div
            className="sos-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="sos-modal-header">
              <div className="sos-modal-title-group">
                <span className="sos-badge-urgent">
                  <span className="urgent-dot"></span> EMERGENCY RESPONSE
                </span>
                <h3>{t("Instant SOS & Safety Broadcast")}</h3>
                <p className="sos-subtitle">
                  {t(
                    "One tap connects directly to national emergency lines and shares your live GPS with trusted contacts."
                  )}
                </p>
              </div>
              <button
                type="button"
                className="sos-close-btn"
                onClick={() => setModalOpen(false)}
                disabled={loading}
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Live GPS Coordinates Card */}
            <div className="sos-gps-card">
              <div className="sos-gps-info">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className={`gps-icon ${coords.isLive ? "live" : "pending"}`}
                />
                <div className="gps-details">
                  <div className="gps-status-row">
                    <span className="gps-label">
                      {coords.isLive
                        ? t("Live GPS Locked")
                        : t("Acquiring GPS...")}
                    </span>
                    {coords.accuracy && (
                      <span className="gps-accuracy">
                        ±{coords.accuracy}m precision
                      </span>
                    )}
                  </div>
                  <div className="gps-coords-text">
                    {coords.isLive
                      ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
                      : t("Waiting for satellite signal...")}
                  </div>
                </div>
              </div>

              <div className="gps-actions">
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gps-map"
                    title="Open in Google Maps"
                  >
                    <span>{t("Map")}</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </a>
                )}
                <button
                  type="button"
                  className="btn-gps-refresh"
                  onClick={fetchLiveGPS}
                  title="Refresh GPS"
                >
                  <FontAwesomeIcon icon={faRotate} />
                </button>
              </div>
            </div>

            {/* Status Alert Banner */}
            {activeStatus && (
              <div className="sos-status-alert">
                <FontAwesomeIcon icon={faSpinner} spin={loading} />
                <span>{activeStatus}</span>
              </div>
            )}

            {/* Priority Emergency Call Cards */}
            <div className="sos-actions-list">
              {/* Option 1: National Emergency Police 112 */}
              <button
                type="button"
                className="sos-action-card sos-primary-action"
                onClick={() => handleTrigger("police")}
                disabled={loading}
              >
                <div className="sos-action-icon bg-red">
                  <FontAwesomeIcon icon={faPhoneVolume} />
                </div>
                <div className="sos-action-info">
                  <div className="sos-action-headline">
                    <h4>{t("National Police (112)")}</h4>
                    <span className="sos-badge-tag">{t("Instant 24/7")}</span>
                  </div>
                  <p>{t("Direct emergency police response with live GPS transmission")}</p>
                </div>
              </button>

              {/* Option 2: Women Police Cell 1091 */}
              <button
                type="button"
                className="sos-action-card"
                onClick={() => handleTrigger("police")}
                disabled={loading}
              >
                <div className="sos-action-icon bg-blue">
                  <FontAwesomeIcon icon={faShieldHeart} />
                </div>
                <div className="sos-action-info">
                  <div className="sos-action-headline">
                    <h4>{t("Women Police Helpline (1091)")}</h4>
                  </div>
                  <p>{t("Dedicated state police helpline for women in distress")}</p>
                </div>
              </button>

              {/* Option 3: SheRise & Women Commission 181 */}
              <button
                type="button"
                className="sos-action-card"
                onClick={() => handleTrigger("sherise")}
                disabled={loading}
              >
                <div className="sos-action-icon bg-purple">
                  <FontAwesomeIcon icon={faTowerBroadcast} />
                </div>
                <div className="sos-action-info">
                  <div className="sos-action-headline">
                    <h4>{t("Women in Distress Support (181)")}</h4>
                  </div>
                  <p>{t("Immediate domestic crisis and legal shelter assistance")}</p>
                </div>
              </button>
            </div>

            {/* Dual Deterrence & Broadcast Grid */}
            <div className="sos-secondary-grid">
              {/* WhatsApp Broadcast */}
              <a
                href={getWhatsAppEmergencyUrl("", coords)}
                target="_blank"
                rel="noreferrer"
                className="sos-tool-btn btn-whatsapp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="tool-btn-icon" />
                <div>
                  <strong>{t("WhatsApp Live SOS")}</strong>
                  <small>{t("Share live location link in 1 tap")}</small>
                </div>
              </a>

              {/* Audible Deterrent Siren */}
              <button
                type="button"
                className={`sos-tool-btn btn-siren ${
                  sirenPlaying ? "siren-active" : ""
                }`}
                onClick={toggleSiren}
              >
                <FontAwesomeIcon
                  icon={sirenPlaying ? faVolumeXmark : faVolumeHigh}
                  className="tool-btn-icon"
                />
                <div>
                  <strong>
                    {sirenPlaying ? t("Stop Siren") : t("Sound Piercing Siren")}
                  </strong>
                  <small>
                    {sirenPlaying
                      ? t("Loud alarm sounding...")
                      : t("Deter attacker & alert bystanders")}
                  </small>
                </div>
              </button>
            </div>

            {/* Trusted Personal Emergency Contacts Section */}
            <div className="sos-contacts-section">
              <div className="contacts-header-row">
                <button
                  type="button"
                  className="btn-toggle-contacts"
                  onClick={() => setShowContactsManager(!showContactsManager)}
                >
                  <FontAwesomeIcon icon={faAddressBook} />
                  <span>
                    {t("Trusted Emergency Contacts")} ({contacts.length})
                  </span>
                </button>
                <small className="contacts-hint">
                  {t("Saved privately on your device")}
                </small>
              </div>

              {showContactsManager && (
                <div className="contacts-manager-drawer">
                  {contacts.length > 0 ? (
                    <div className="contacts-list">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="contact-item">
                          <div className="contact-meta">
                            <strong>{contact.name}</strong>
                            <span>{contact.phone || t("No phone saved")}</span>
                          </div>

                          <div className="contact-actions">
                            {contact.phone && (
                              <>
                                <a
                                  href={`tel:${contact.phone}`}
                                  className="btn-contact-action btn-call"
                                  title={`Call ${contact.name}`}
                                >
                                  <FontAwesomeIcon icon={faPhoneVolume} />
                                </a>
                                <a
                                  href={getWhatsAppEmergencyUrl(
                                    contact.phone,
                                    coords
                                  )}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn-contact-action btn-wa"
                                  title={`WhatsApp SOS to ${contact.name}`}
                                >
                                  <FontAwesomeIcon icon={faWhatsapp} />
                                </a>
                              </>
                            )}
                            <button
                              type="button"
                              className="btn-contact-action btn-del"
                              onClick={() => handleDeleteContact(contact.id)}
                              title="Delete Contact"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-contacts-text">
                      {t("No emergency contacts added yet.")}
                    </p>
                  )}

                  {/* Add Contact Mini Form */}
                  <form onSubmit={handleAddContact} className="add-contact-form">
                    <input
                      type="text"
                      placeholder={t("Name (e.g. Mom, Sister)")}
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="contact-input"
                    />
                    <input
                      type="tel"
                      placeholder={t("Phone number")}
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      className="contact-input"
                    />
                    <button type="submit" className="btn-add-contact">
                      <FontAwesomeIcon icon={faPlus} />
                      <span>{t("Add")}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
