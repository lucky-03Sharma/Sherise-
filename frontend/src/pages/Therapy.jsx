import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Therapy() {
  const [therapists, setTherapists] = useState([]);
  const [form, setForm] = useState({
    issueType: "",
    description: "",
    sessionDate: "",
  });

  // 🔹 Fetch therapists (optional backend)
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const res = await API.get("/therapy");
        setTherapists(res.data || []);
      } catch (err) {
        console.log("Error fetching therapists:", err);

        // fallback demo data
        setTherapists([
          { name: "Dr. Priya Sharma", specialization: "Anxiety & Stress" },
          { name: "Dr. Neha Verma", specialization: "Trauma Recovery" },
        ]);
      }
    };

    fetchTherapists();
  }, []);

  // 🔹 Submit therapy request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/therapy/create", form);
      alert("Therapy request submitted ✅");

      setForm({
        issueType: "",
        description: "",
        sessionDate: "",
      });
    } catch (err) {
      console.log("Submit error:", err);
      alert("Failed to submit. Please log in and try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Therapy Support</h2>

      {/* 🔹 Request Form */}
      <form onSubmit={handleSubmit}>
        <select
          value={form.issueType}
          onChange={(e) =>
            setForm({ ...form, issueType: e.target.value })
          }
        >
          <option value="">Select issue type</option>
          <option value="anxiety">Anxiety</option>
          <option value="depression">Depression</option>
          <option value="trauma">Trauma</option>
          <option value="stress">Stress</option>
          <option value="other">Other</option>
        </select>

        <textarea
          placeholder="Describe your situation"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="date"
          value={form.sessionDate}
          onChange={(e) =>
            setForm({ ...form, sessionDate: e.target.value })
          }
        />

        <button type="submit">Request Help</button>
      </form>

      {/* 🔹 Therapist List */}
      <h3>Available Therapists</h3>

      {therapists.length === 0 ? (
        <p>No therapists available</p>
      ) : (
        therapists.map((t, i) => (
          <div
            key={i}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px",
            }}
          >
            <h4>{t.name}</h4>
            <p>{t.specialization}</p>
          </div>
        ))
      )}
    </div>
  );
}