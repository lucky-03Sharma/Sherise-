import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faPhoneVolume, faSpinner } from "@fortawesome/free-solid-svg-icons";
import API from "../services/api";
import Navbar from "../components/Navbar";
import IconCircle from "../components/IconCircle";
import VoiceHelpSOS from "../components/VoiceHelpSOS";
import LiveAlertsPanel from "../components/LiveAlertsPanel";
import { dialHelpline, startEmergencyCall } from "../services/emergencyService";
import { startLiveLocationSharing } from "../services/liveLocationClient";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import "../css/pages-common.css";
import "../css/emergency-features.css";

const categoryLabels = {
  police: "Police",
  legal: "Legal Aid",
  mental: "Mental Health",
  domestic: "Domestic Violence",
  ngo: "NGO Support",
};

export default function Helplines() {
  const [data, setData] = useState([]);
  const [callingId, setCallingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHelplines = async () => {
      try {
        const res = await API.get("/helplines");
        setData(res.data || []);
      } catch (err) {
        console.log("Error fetching helplines:", err);
      }
    };

    fetchHelplines();
  }, []);

  const handleCallNow = async (helpline) => {
    setCallingId(helpline._id || helpline.phone);
    setMessage("");

    try {
      const result = await startEmergencyCall(helpline, "manual_call");
      startLiveLocationSharing(result.alert._id);
      setMessage(
        `Live GPS shared with ${helpline.name}. Opening phone dialer to call ${helpline.phone}…`
      );
      dialHelpline(result.dialNumber || helpline.phone);
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Could not start emergency call. Allow location access."));
    } finally {
      setCallingId(null);
    }
  };

  return (
    <div className="service-page app-page">
      <Navbar />

      <div className="page-main">
        <h2 className="service-title">Emergency Helplines</h2>
        <p className="service-subtitle">
          Call Now shares your live GPS with the helpline centre, then opens your phone dialer
          to connect directly.
        </p>

        {message && <div className="alert alert-info">{message}</div>}

        <VoiceHelpSOS
          onTriggered={(result) =>
            setMessage(
              `Voice SOS activated — calling ${result.helpline.name} with live location.`
            )
          }
        />

        <LiveAlertsPanel />

        {data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconCircle icon={faPhoneVolume} />
            </div>
            <p>No helplines available at the moment.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {data.map((h, i) => (
              <div className="info-card" key={h._id || i}>
                <div className="info-card-header">
                  <IconCircle icon={faPhone} className="info-card-avatar" />
                  <div className="info-card-header-text">
                    <h4>{h.name}</h4>
                    <p>{categoryLabels[h.category] || h.category}</p>
                  </div>
                </div>

                <div className="info-card-body">
                  <p>
                    <span className="label">Phone: </span>
                    {h.phone}
                  </p>

                  {h.description && (
                    <p>
                      <span className="label">About: </span>
                      {h.description}
                    </p>
                  )}

                  {h.location && (
                    <p>
                      <span className="label">Location: </span>
                      {h.location}
                    </p>
                  )}

                  <div>
                    <span className="tag">{h.category}</span>
                    {h.isEmergency && (
                      <span className="tag tag-emergency">Emergency</span>
                    )}
                  </div>
                </div>

                <div className="info-card-footer">
                  <button
                    type="button"
                    className="btn btn-danger btn-with-icon"
                    disabled={callingId === (h._id || h.phone)}
                    onClick={() => handleCallNow(h)}
                  >
                    <FontAwesomeIcon
                      icon={callingId === (h._id || h.phone) ? faSpinner : faPhone}
                      spin={callingId === (h._id || h.phone)}
                    />
                    Call Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
