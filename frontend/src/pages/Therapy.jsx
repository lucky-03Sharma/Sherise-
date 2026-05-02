import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Therapy() {
  const [therapists, setTherapists] = useState([]);
  const [form, setForm] = useState({
    name: "",
    issue: "",
    message: "",
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
      await API.post("/therapy/request", form);
      alert("Therapy request submitted ✅");

      setForm({
        name: "",
        issue: "",
        message: "",
      });
    } catch (err) {
      console.log("Submit error:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Therapy Support</h2>

      {/* 🔹 Request Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Issue (Anxiety, Abuse, Trauma...)"
          value={form.issue}
          onChange={(e) =>
            setForm({ ...form, issue: e.target.value })
          }
        />

        <textarea
          placeholder="Describe your situation"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
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