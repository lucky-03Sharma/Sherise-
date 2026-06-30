import { useEffect, useState } from "react";
import API from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import Navbar from "../components/Navbar";

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
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

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
    if (
      !form.name ||
      !form.type ||
      !form.description ||
      !form.location
    ) {
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

      setMyComplaints((prev) =>
        prev.filter((complaint) => complaint._id !== id)
      );

      setComplaints((prev) =>
        prev.filter((complaint) => complaint._id !== id)
      );
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

      <div className="container mt-4">
        <h2 className="complaints-title">Complaints</h2>

        <div className="complaint-form">
          <input
            className="form-control mb-3"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <select
            className="form-select mb-3"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
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
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <input
            className="form-control mb-3"
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
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
          style={{ cursor: "pointer" }}
          onClick={() => setShowMyComplaints(!showMyComplaints)}
        >
          {showMyComplaints ? "▼" : "▶"} My Complaints
        </h3>

        {showMyComplaints &&
          (myComplaints.length === 0 ? (
            <div className="alert alert-info">
              You haven't submitted any complaints.
            </div>
          ) : (
            myComplaints.map((c) => (
              <div key={c._id} className="complaint-card">
                <div className="complaint-header">
                  <h5 className="card-title">{c.type}</h5>

                  <span className="complaint-date">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="complaint-body">
                  <p>
                    <strong>Name:</strong> {c.name}
                  </p>

                  <p>
                    <strong>Location:</strong> {c.location}
                  </p>

                  <p>
                    <strong>Description</strong>
                  </p>

                  <div className="description-box">
                    {c.description}
                  </div>
                </div>

                <div className="complaint-footer">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteComplaint(c._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ))}

        <hr />

        <h3
          className="complaints-subtitle"
          style={{ cursor: "pointer" }}
          onClick={() => setShowAllComplaints(!showAllComplaints)}
        >
          {showAllComplaints ? "▼" : "▶"} All Complaints
        </h3>

        {showAllComplaints &&
          (complaints.length === 0 ? (
            <div className="alert alert-info">
              No complaints available.
            </div>
          ) : (
            <div className="all-complaints-list">
              {complaints.map((c) => (
                <div key={c._id} className="complaint-card">
                  <div className="complaint-top">
                    <div>
                      <h4 className="complaint-type">{c.type}</h4>

                      <span className="complaint-date">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span className="complaint-status">
                      Active
                    </span>
                  </div>

                  <div className="complaint-content">
                    <div className="complaint-row">
                      <span className="label">Name</span>
                      <span>{c.name}</span>
                    </div>

                    <div className="complaint-row">
                      <span className="label"> Location</span>
                      <span>{c.location}</span>
                    </div>

                    <div className="complaint-description">
                      <h6>Description</h6>
                      <p>{c.description}</p>
                    </div>
                  </div>

                  <div className="complaint-footer">
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteComplaint(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}