import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Consultation() {
  const [form, setForm] = useState({
    name: "",
    issue: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Consultation Request:", form);
    alert("Your request has been submitted!");
    
    // reset form
    setForm({
      name: "",
      issue: "",
      message: "",
    });
  };

  return (
    <div>
      <Navbar />
      <h2>Consult an Expert</h2>

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
          placeholder="Issue Type (Legal / Mental / Domestic)"
          value={form.issue}
          onChange={(e) =>
            setForm({ ...form, issue: e.target.value })
          }
        />

        <textarea
          placeholder="Describe your problem"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        <button type="submit">Request Consultation</button>
      </form>
    </div>
  );
}