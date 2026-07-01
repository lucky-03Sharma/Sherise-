import { useEffect, useState } from "react";
import API from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import Navbar from "../components/Navbar";
import "../css/pages-common.css";

function getInitials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function guessIssueType(specialization) {
  const s = (specialization || "").toLowerCase();
  if (s.includes("anxiety")) return "anxiety";
  if (s.includes("stress")) return "stress";
  if (s.includes("trauma")) return "trauma";
  if (s.includes("depression")) return "depression";
  return "other";
}

const issueLabels = {
  anxiety: "Anxiety",
  depression: "Depression",
  trauma: "Trauma",
  stress: "Stress",
  other: "Other",
};

const statusLabels = {
  requested: "Requested",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function Therapy() {
  const [therapists, setTherapists] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    issueType: "",
    description: "",
    sessionDate: "",
  });
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const fetchTherapists = async () => {
    try {
      const res = await API.get("/therapy");
      setTherapists(res.data || []);
    } catch (err) {
      console.log("Error fetching therapists:", err);
      setTherapists([
        { name: "Dr. Priya Sharma", specialization: "Anxiety & Stress" },
        { name: "Dr. Neha Verma", specialization: "Trauma Recovery" },
      ]);
    }
  };

  const fetchMySessions = async () => {
    try {
      const res = await API.get("/therapy/my");
      setMySessions(res.data.sessions || []);
    } catch (err) {
      console.log("Error fetching sessions:", err);
    }
  };

  useEffect(() => {
    fetchTherapists();
    fetchMySessions();
  }, []);

  const openBooking = (therapist) => {
    setSelectedTherapist(therapist);
    setBookingForm({
      issueType: guessIssueType(therapist.specialization),
      description: "",
      sessionDate: "",
    });
    setMessage("");
    setShowPopup(false);
  };

  const closeBooking = () => {
    setSelectedTherapist(null);
    setBookingForm({ issueType: "", description: "", sessionDate: "" });
  };

  const handleBookSession = async (e) => {
    e.preventDefault();

    if (!bookingForm.issueType || !bookingForm.description.trim() || !bookingForm.sessionDate) {
      setMessage("Please fill in issue type, description, and appointment date.");
      setShowPopup(true);
      return;
    }

    setLoading(true);
    try {
      await API.post("/therapy/create", {
        psychologistName: selectedTherapist.name,
        issueType: bookingForm.issueType,
        description: bookingForm.description.trim(),
        sessionDate: bookingForm.sessionDate,
      });

      setMessage(`Session booked with ${selectedTherapist.name} successfully!`);
      setShowPopup(true);
      closeBooking();
      fetchMySessions();
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Failed to book session"));
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id) => {
    try {
      await API.delete(`/therapy/${id}`);
      setMessage("Appointment cancelled successfully.");
      setShowPopup(true);
      setMySessions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setMessage(getApiErrorMessage(err));
      setShowPopup(true);
    }
  };

  return (
    <div className="service-page app-page">
      <Navbar />

      <div className="page-main">
        <h2 className="service-title">Therapy Support</h2>
        <p className="service-subtitle">
          Choose a therapist and book an appointment — sessions require a scheduled date.
        </p>

        {showPopup && message && !selectedTherapist && (
          <div
            className={`alert mb-4 ${
              message.includes("successfully") || message.includes("booked")
                ? "alert-success"
                : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <div className="section-header">
          <span>Available Therapists</span>
          <span className="badge-count">{therapists.length}</span>
        </div>

        {therapists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧠</div>
            <p>No therapists available at the moment.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {therapists.map((t, i) => (
              <div className="info-card" key={i}>
                <div className="info-card-header">
                  <span className="info-card-avatar">{getInitials(t.name)}</span>
                  <div className="info-card-header-text">
                    <h4>{t.name}</h4>
                    <p>Licensed Therapist</p>
                  </div>
                </div>

                <div className="info-card-body">
                  <p>
                    <span className="label">Specialization: </span>
                    {t.specialization}
                  </p>
                  <span className="tag tag-status">Available</span>
                </div>

                <div className="info-card-footer">
                  <button
                    className="btn btn-primary btn-book"
                    onClick={() => openBooking(t)}
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="section-header">
          <span>My Appointments</span>
          <span className="badge-count">{mySessions.length}</span>
        </div>

        {mySessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <p>No appointments yet. Book a session with a therapist above.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {mySessions.map((s) => (
              <div className="info-card" key={s._id}>
                <div className="info-card-header">
                  <span className="info-card-avatar">📅</span>
                  <div className="info-card-header-text">
                    <h4>{s.psychologistName || "Therapist"}</h4>
                    <p>
                      {s.sessionDate
                        ? new Date(s.sessionDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Date pending"}
                    </p>
                  </div>
                </div>

                <div className="info-card-body">
                  <p>
                    <span className="label">Issue: </span>
                    {issueLabels[s.issueType] || s.issueType}
                  </p>
                  <p>{s.description}</p>
                  <span
                    className={`tag ${
                      s.status === "requested" ? "tag-pending" : "tag-status"
                    }`}
                  >
                    {statusLabels[s.status] || s.status}
                  </span>
                </div>

                <div className="info-card-footer">
                  {s.status === "requested" && (
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteSession(s._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTherapist && (
        <div className="booking-overlay" onClick={closeBooking}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-modal-header">
              <h3>Book with {selectedTherapist.name}</h3>
              <button className="booking-close" onClick={closeBooking} type="button">
                ×
              </button>
            </div>

            <form onSubmit={handleBookSession}>
              <p className="booking-hint">
                Specialization: {selectedTherapist.specialization}
              </p>

              <label className="booking-label">Issue Type</label>
              <select
                className="form-select mb-3"
                value={bookingForm.issueType}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, issueType: e.target.value })
                }
                required
              >
                <option value="">Select issue type</option>
                <option value="anxiety">Anxiety</option>
                <option value="stress">Stress</option>
                <option value="trauma">Trauma</option>
                <option value="depression">Depression</option>
                <option value="other">Other</option>
              </select>

              <label className="booking-label">Appointment Date</label>
              <input
                className="form-control mb-3"
                type="date"
                min={minDateStr}
                value={bookingForm.sessionDate}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, sessionDate: e.target.value })
                }
                required
              />

              <label className="booking-label">Describe your situation</label>
              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Share what you'd like help with..."
                value={bookingForm.description}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, description: e.target.value })
                }
                required
              />

              {showPopup && message && (
                <div
                  className={`alert mb-3 ${
                    message.includes("successfully") || message.includes("booked")
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                >
                  {message}
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
