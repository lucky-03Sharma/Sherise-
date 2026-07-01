import { useEffect, useState } from "react";
import API from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import Navbar from "../components/Navbar";
import ComplaintCard from "../components/ComplaintCard";
import "../css/complaint.css";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);

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
      await API.post("/complaints/create", form);

      setMessage("Complaint submitted successfully");
      setShowPopup(true);

      setForm({
        name: "",
        type: "",
        description: "",
        location: "",
        isAnonymous: false,
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
        <h2 className="complaints-title">Register a Complaint</h2>
        <p className="complaints-lead">
          Your safety matters. Report incidents securely and track your submissions below.
        </p>

        <div className="complaint-form">
          <input
            className="form-control mb-3"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            className="form-select mb-3"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Select Complaint Type</option>
            <option value="Sexual harassment">Sexual Harassment</option>
            <option value="Domestic Violence">Domestic Violence</option>
            <option value="Rape">Rape</option>
            <option value="Threats">Threats</option>
            <option value="Mental Torture">Mental Torture</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            className="form-control mb-3"
            rows="4"
            placeholder="Describe what happened..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            className="form-control mb-3"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <button
            className="btn btn-primary"
            onClick={submitComplaint}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Complaint"}
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
            {showMyComplaints ? "▼" : "▶"} My Complaints
          </span>
          <span className="badge-count">{myComplaints.length}</span>
        </h3>

        {showMyComplaints &&
          (myComplaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
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
            {showAllComplaints ? "▼" : "▶"} All Complaints
          </span>
          <span className="badge-count">{complaints.length}</span>
        </h3>

        {showAllComplaints &&
          (complaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
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
