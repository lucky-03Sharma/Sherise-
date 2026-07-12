import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMapLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { getActiveEmergencyAlerts } from "../services/emergencyService";
import { stopLiveLocationSharing } from "../services/liveLocationClient";

export default function LiveAlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const data = await getActiveEmergencyAlerts();
      setAlerts(data);
    } catch (err) {
      console.log("Could not load live alerts:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleStopSharing = async (alertId) => {
    sessionStorage.setItem("activeEmergencyAlertId", alertId);
    await stopLiveLocationSharing();
    fetchAlerts();
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="live-alerts-panel">
      <h4>
        <FontAwesomeIcon icon={faMapLocationDot} /> Active Live Location Alerts
      </h4>
      <p className="live-alerts-note">
        Responders at helpline centres can trace these live GPS coordinates.
      </p>

      {alerts.map((alert) => (
        <div className="live-alert-card" key={alert._id}>
          <div className="live-alert-top">
            <strong>{alert.userName || "User"}</strong>
            <span className="tag tag-emergency">{alert.triggerType === "voice_help" ? "Voice SOS" : "Emergency Call"}</span>
          </div>
          <p>
            <span className="label">Helpline: </span>
            {alert.helplineName} ({alert.helplinePhone})
          </p>
          <p>
            <FontAwesomeIcon icon={faLocationDot} />{" "}
            {alert.latitude?.toFixed(5)}, {alert.longitude?.toFixed(5)}
            {alert.accuracy ? ` (±${Math.round(alert.accuracy)}m)` : ""}
          </p>
          <div className="live-alert-actions">
            <a
              href={alert.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm"
            >
              Open in Maps
            </a>
            <a href={`tel:${alert.helplinePhone}`} className="btn btn-danger btn-sm btn-with-icon">
              <FontAwesomeIcon icon={faPhone} />
              Call Back
            </a>
            {alert._id === sessionStorage.getItem("activeEmergencyAlertId") && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleStopSharing(alert._id)}
              >
                Stop Sharing
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
