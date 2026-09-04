import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faClipboardList,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import API from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import Navbar from "../components/Navbar";
import ComplaintCard from "../components/ComplaintCard";
import ComplaintMediaCapture from "../components/ComplaintMediaCapture";
import IconCircle from "../components/IconCircle";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/pages-common.css";
import "../css/emergency-features.css";
import "../css/complaint.css";

export default function Complaints() {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [mediaFiles, setMediaFiles] = useState({
    imageFiles: [],
    videoFiles: [],
    voiceBlob: null,
    latitude: "",
    longitude: "",
    gpsLabel: "",
  });

  const [showMyComplaints, setShowMyComplaints] = useState(true);
  const [showAllComplaints, setShowAllComplaints] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    location: "",
    isAnonymous: false,
  });

  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMyComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setMyComplaints(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const submitComplaint = async () => {
    if (!form.name || !form.type || !form.description || !form.location) {
      setMessage("Please fill all the fields");
      setShowPopup(true);
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("type", form.type);
      payload.append("description", form.description);
      payload.append("location", form.location);
      payload.append("isAnonymous", String(form.isAnonymous));

      if (mediaFiles.latitude && mediaFiles.longitude) {
        payload.append("latitude", mediaFiles.latitude);
        payload.append("longitude", mediaFiles.longitude);
        if (!form.location.includes(",")) {
          payload.set(
            "location",
            `${form.location} (GPS: ${mediaFiles.gpsLabel})`
          );
        }
      }

      mediaFiles.imageFiles.forEach((file) => payload.append("images", file));
      mediaFiles.videoFiles.forEach((file) => payload.append("videos", file));

      if (mediaFiles.voiceBlob) {
        payload.append(
          "voiceNote",
          mediaFiles.voiceBlob,
          `voice-note-${Date.now()}.webm`
        );
      }

      await API.post("/complaints/create", payload);

      setMessage("Complaint submitted successfully");
      setShowPopup(true);

      setForm({
        name: "",
        type: "",
        description: "",
        location: "",
        isAnonymous: false,
      });
      setMediaFiles({
        imageFiles: [],
        videoFiles: [],
        voiceBlob: null,
        latitude: "",
        longitude: "",
        gpsLabel: "",
      });

      fetchComplaints();
      fetchMyComplaints();
    } catch (err) {
      setMessage(getApiErrorMessage(err));
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteComplaint = async (id) => {
    try {
      await API.delete(`/complaints/${id}`);

      setMessage("Complaint deleted successfully");
      setShowPopup(true);

      setMyComplaints((prev) => prev.filter((c) => c._id !== id));
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setMessage(getApiErrorMessage(err));
      setShowPopup(true);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchMyComplaints();
  }, []);

  return (
    <div className="complaints-page">
      <Navbar />

      <div className="page-main">
        <h2 className="complaints-title">{t("Register a Complaint")}</h2>
        <p className="complaints-lead">
          {t("Your safety matters. Report incidents securely and track your submissions below.")}
        </p>

        <div className="ai-severity-info-banner alert alert-light border mb-4 d-flex align-items-center gap-3">
          <div className="severity-badge severity-badge-urgent flex-shrink-0">
            AI Severity
          </div>
          <small className="text-muted">
            {t("Complaints are automatically analyzed by our AI severity detection engine. Most urgent cases involving physical danger, violence, or threats are prioritized first for rapid response.")}
          </small>
        </div>

        <div className="complaint-form">
          <input
            className="form-control mb-3"
            placeholder={t("Your Name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            className="form-select mb-3"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">{t("Select Complaint Type")}</option>
            <option value="Sexual harassment">{t("Sexual Harassment")}</option>
            <option value="Domestic Violence">{t("Domestic Violence")}</option>
            <option value="Rape">{t("Rape")}</option>
            <option value="Threats">{t("Threats")}</option>
            <option value="Mental Torture">{t("Mental Torture")}</option>
            <option value="Other">{t("Other")}</option>
          </select>

          <textarea
            className="form-control mb-3"
            rows="4"
            placeholder={t("Describe what happened...")}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            className="form-control mb-3"
            placeholder={t("Location")}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <ComplaintMediaCapture onMediaChange={setMediaFiles} />

          <button
            className="btn btn-primary"
            onClick={submitComplaint}
            disabled={loading}
          >
            {loading ? t("Submitting...") : t("Submit Complaint")}
          </button>

          {showPopup && (
            <div
              className={`alert mt-3 ${
                message.toLowerCase().includes("success")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <hr />

        <h3
          className="complaints-subtitle"
          onClick={() => setShowMyComplaints(!showMyComplaints)}
        >
          <span>
            <FontAwesomeIcon
              icon={showMyComplaints ? faChevronDown : faChevronRight}
              className="complaints-subtitle-icon"
            />
            My Complaints
          </span>
          <span className="badge-count">{myComplaints.length}</span>
        </h3>

        {showMyComplaints &&
          (myComplaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <IconCircle icon={faClipboardList} />
              </div>
              <p>You haven't submitted any complaints yet.</p>
              <p className="empty-hint">Use the form above to register your first complaint.</p>
            </div>
          ) : (
            <div className="my-complaints-list">
              {myComplaints.map((c) => (
                <ComplaintCard
                  key={c._id}
                  data={c}
                  showDelete
                  onDelete={deleteComplaint}
                />
              ))}
            </div>
          ))}

        <hr />

        <h3
          className="complaints-subtitle"
          onClick={() => setShowAllComplaints(!showAllComplaints)}
        >
          <span>
            <FontAwesomeIcon
              icon={showAllComplaints ? faChevronDown : faChevronRight}
              className="complaints-subtitle-icon"
            />
            All Complaints
          </span>
          <span className="badge-count">{complaints.length}</span>
        </h3>

        {showAllComplaints &&
          (complaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <IconCircle icon={faMagnifyingGlass} />
              </div>
              <p>No complaints have been registered yet.</p>
            </div>
          ) : (
            <div className="all-complaints-list">
              {complaints.map((c) => (
                <ComplaintCard key={c._id} data={c} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
