import { useState } from "react";
import Navbar from "../components/Navbar";
import { createConsultation } from "../services/consultationServices";
import "../css/consultation.css";

export default function Consultation() {

  const [form, setForm] = useState({
    issue: "",
    description: "",
    category: "",
  });

  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.issue ||
      !form.category ||
      !form.description
    ) {
      setMessage("Please fill all the fields.");
      setShowPopup(true);
      return;
    }

    try {
      setLoading(true);

      await createConsultation(form);

      setMessage(
        "Consultation request submitted successfully!"
      );
      setShowPopup(true);

      setForm({
        issue: "",
        description: "",
        category: "",
      });

    } catch (err) {

      console.log("Submit error:", err);

      setMessage(
        "Failed to submit. Please log in and try again."
      );

      setShowPopup(true);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div>

      <Navbar />

      <div className="container mt-4">

        <h2 className="text-center mb-4">
          Consult an Expert
        </h2>

        <div className="card shadow p-4">

          <form onSubmit={handleSubmit}>

            <input
              className="form-control mb-3"
              type="text"
              placeholder="Issue (e.g. workplace harassment)"
              value={form.issue}
              onChange={(e) =>
                setForm({
                  ...form,
                  issue: e.target.value,
                })
              }
            />

            <select
              className="form-select mb-3"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            >
              <option value="">
                Select category
              </option>

              <option value="legal">
                Legal
              </option>

              <option value="mental">
                Mental
              </option>

              <option value="domestic">
                Domestic
              </option>

              <option value="harassment">
                Harassment
              </option>

            </select>

            <textarea
              className="form-control mb-3"
              rows="4"
              placeholder="Describe your problem"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Request Consultation"}
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

      </div>

    </div>
  );
}