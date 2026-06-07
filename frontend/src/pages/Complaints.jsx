import { useEffect, useState } from "react";
import API from "../services/api";
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

  // 🔹 Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  // 🔹 Submit complaint
  const submitComplaint = async () => {
    try {
      await API.post("/complaints/create", form);
      fetchComplaints();
    } catch (err) {
      console.log("Submit error:", err);
      alert("Failed to submit. Please log in and try again.");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Complaints</h2>

      {/* FORM */}
      <div>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Select type</option>
          <option value="Sexual harassment">Sexual harassment</option>
          <option value="Domestic Violence">Domestic Violence</option>
          <option value="Rape">Rape</option>
          <option value="Threats">Threats</option>
          <option value="Mental Torture">Mental Torture</option>
          <option value="Other">Other</option>
        </select>

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <button onClick={submitComplaint}>Submit</button>
      </div>

      {/* LIST */}
      <h3>All Complaints</h3>

      {complaints.length === 0 ? (
        <p>No complaints yet</p>
      ) : (
        complaints.map((c, index) => (
          <div key={index} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
            <p><b>Name:</b> {c.name}</p>
            <p><b>Type:</b> {c.type}</p>
            <p><b>Description:</b> {c.description}</p>
            <p><b>Location:</b> {c.location}</p>
          </div>
        ))
      )}
    </div>
  );
}