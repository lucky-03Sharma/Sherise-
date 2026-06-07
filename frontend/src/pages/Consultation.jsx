import { useState } from "react";
import Navbar from "../components/Navbar";
import { createConsultation } from "../services/consultationServices";

export default function Consultation() {
  const [form, setForm] = useState({
    issue: "",
    description: "",
    category: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createConsultation(form);
      alert("Your request has been submitted!");

      setForm({
        issue: "",
        description: "",
        category: "",
      });
    } catch (err) {
      console.log("Submit error:", err);
      alert("Failed to submit. Please log in and try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Consult an Expert</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Issue (e.g. workplace harassment)"
          value={form.issue}
          onChange={(e) =>
            setForm({ ...form, issue: e.target.value })
          }
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="">Select category</option>
          <option value="legal">Legal</option>
          <option value="mental">Mental</option>
          <option value="domestic">Domestic</option>
          <option value="harassment">Harassment</option>
        </select>

        <textarea
          placeholder="Describe your problem"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button type="submit">Request Consultation</button>
      </form>
    </div>
  );
}
