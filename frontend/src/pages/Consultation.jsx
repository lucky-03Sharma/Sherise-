import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  createConsultation,
  getMyConsultations,
} from "../services/consultationServices";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import API from "../services/api";
import "../css/pages-common.css";

const categoryLabels = {
  legal: "Legal",
  mental: "Mental Health",
  domestic: "Domestic",
  harassment: "Harassment",
};

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  resolved: "Resolved",
};

export default function Consultation() {
  const [form, setForm] = useState({
    issue: "",
    description: "",
    category: "",
  });

  const [myConsultations, setMyConsultations] = useState([]);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMyConsultations = async () => {
    try {
      const res = await getMyConsultations();
      setMyConsultations(res.data.consultations || []);
    } catch (err) {
      console.log("Error fetching consultations:", err);
    }
  };

  useEffect(() => {
    fetchMyConsultations();
  }, []);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.issue || !form.category || !form.description) {
      setMessage("Please fill all the fields.");
      setShowPopup(true);
      return;
    }

    try {
      setLoading(true);
      await createConsultation(form);

      setMessage("Consultation request submitted successfully!");
      setShowPopup(true);

      setForm({ issue: "", description: "", category: "" });
      fetchMyConsultations();
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Failed to submit. Please log in and try again."));
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteConsultation = async (id) => {
    try {
      await API.delete(`/consultations/delete/${id}`);
      setMessage("Consultation deleted successfully.");
      setShowPopup(true);
      setMyConsultations((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setMessage(getApiErrorMessage(err));
      setShowPopup(true);
    }
  };

  return (
    <div className="service-page app-page">
      <Navbar />

      <div className="page-main">
        <h2 className="service-title">Consult an Expert</h2>
        <p className="service-subtitle">
          Get confidential guidance from legal, mental health, and support professionals.
        </p>

        <div className="service-form">
          <h5 className="mb-3" style={{ color: "#a45a8d", fontWeight: 700 }}>
            New Consultation Request
          </h5>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Issue (e.g. workplace harassment)"
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
            />

            <select
              className="form-select mb-3"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="legal">Legal</option>
              <option value="mental">Mental</option>
              <option value="domestic">Domestic</option>
              <option value="harassment">Harassment</option>
            </select>

            <textarea
              className="form-control mb-3"
              rows="4"
              placeholder="Describe your problem..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Request Consultation"}
            </button>

            {showPopup && (
              <div
                className={`alert mt-3 ${
                  message.includes("successfully")
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>

        <div className="section-header">
          <span>My Consultations</span>
          <span className="badge-count">{myConsultations.length}</span>
        </div>

        {myConsultations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <p>You haven't requested any consultations yet.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {myConsultations.map((c) => (
              <div className="info-card" key={c._id}>
                <div className="info-card-header">
                  <span className="info-card-avatar">💬</span>
                  <div className="info-card-header-text">
                    <h4>{c.issue}</h4>
                    <p>
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="info-card-body">
                  <p>
                    <span className="label">Category: </span>
                    {categoryLabels[c.category] || c.category}
                  </p>

                  <p>{c.description}</p>

                  <span
                    className={`tag ${
                      c.status === "pending" ? "tag-pending" : "tag-status"
                    }`}
                  >
                    {statusLabels[c.status] || c.status}
                  </span>
                </div>

                <div className="info-card-footer">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteConsultation(c._id)}
                  >
                    Delete
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
