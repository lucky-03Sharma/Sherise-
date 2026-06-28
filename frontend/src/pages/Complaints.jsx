import { useEffect, useState } from "react";
import API from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import Navbar from "../components/Navbar";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);

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
      console.log("Fetch error:", err);
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
    } catch (err) {
      console.log("Submit error:", err);

      setMessage(getApiErrorMessage(err));
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="complaints-page">
      <Navbar />

      <div className="container mt-4">
        <h2 className="complaints-title">
          Complaints
        </h2>

        {/* Complaint Form */}

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
            <option value="">
              Select Complaint Type
            </option>

            <option value="Sexual harassment">
              Sexual Harassment
            </option>

            <option value="Domestic Violence">
              Domestic Violence
            </option>

            <option value="Rape">
              Rape
            </option>

            <option value="Threats">
              Threats
            </option>

            <option value="Mental Torture">
              Mental Torture
            </option>

            <option value="Other">
              Other
            </option>
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
            {loading
              ? "Submitting..."
              : "Submit Complaint"}
          </button>

          {showPopup && (
            <div
              className={`alert mt-3 ${
                message
                  .toLowerCase()
                  .includes("success")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Complaints List */}

        <h3 className="complaints-subtitle">
          All Complaints
        </h3>

        {complaints.length === 0 ? (
          <div className="alert alert-info">
            No complaints yet.
          </div>
        ) : (
          complaints.map((c, index) => (
            <div
              key={index}
              className="complaint-card"
            >
              <div className="card-body">
                <h5 className="card-title">
                  {c.type}
                </h5>

                <p>
                  <strong>Name:</strong>{" "}
                  {c.name}
                </p>

                <p>
                  <strong>Description:</strong>{" "}
                  {c.description}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {c.location}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}