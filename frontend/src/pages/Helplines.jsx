import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import API from "../services/api";
import Navbar from "../components/Navbar";
import IconCircle from "../components/IconCircle";
import "../css/pages-common.css";

const categoryLabels = {
  police: "Police",
  legal: "Legal Aid",
  mental: "Mental Health",
  domestic: "Domestic Violence",
  ngo: "NGO Support",
};

export default function Helplines() {
  const [data, setData] = useState([]);

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

  return (
    <div className="service-page app-page">
      <Navbar />

      <div className="page-main">
        <h2 className="service-title">Emergency Helplines</h2>
        <p className="service-subtitle">
          Reach out instantly — these helplines are available 24/7 for urgent support.
        </p>

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
                  <a href={`tel:${h.phone}`} className="btn btn-danger btn-with-icon">
                    <FontAwesomeIcon icon={faPhone} />
                    Call Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
