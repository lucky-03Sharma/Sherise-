import { useEffect, useState } from "react";
import API from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import Navbar from "../components/Navbar";

export default function Therapy() {
  const [therapists, setTherapists] = useState([]);
  const [form, setForm] = useState({
    name: "",
    issue: "",
    message: "",
  });

  const [message , setMessage]= useState("");
  const[ShowPopup , setShowPopup]= useState(false);
  const[loading, setLoading]= useState(false);
  
  useEffect(() => {
    if(ShowPopup){
      const timer = setTimeout(()=>{
        setShowPopup(false);
      },3000);
      return ()=> clearTimeout(timer);
    }
  }, [ShowPopup]);

  useEffect(()=>{
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
     if (!form.name.trim() || !form.issue.trim() || !form.message.trim()) {
    setMessage("Please fill in all the fields.");
    setShowPopup(true);
    return;
  }
    setLoading(true);
    try {
      await API.post("/therapy/request", form);
      setMessage("Therapy request submitted successfully.");

      setForm({
        name: "",
        issue: "",
        message: "",
      });
    } catch (err) {
      setMessage(getApiErrorMessage(err, "failed to submit"));
      setPopup(true);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Navbar />
      <h2 className="text-center mb-4">
        Therapy Support</h2>
    <div className="card shadow p-4">
      {/* 🔹 Request Form */}
      <form onSubmit={handleSubmit}>
        <input
        className="form-control mb-3"
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
        className="form-control mb-3"
          type="text"
          placeholder="Issue (Anxiety, Abuse, Trauma...)"
          value={form.issue}
          onChange={(e) =>
            setForm({ ...form, issue: e.target.value })
          }
        />

        <textarea
        className="form-control mb-3"
          placeholder="Describe your situation"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        <button type="submit"
        className="btn btn-primary"
        disabled={loading}>
          {loading
                ? "Submitting..."
                : "Request help"}
            </button>

          {ShowPopup && (
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
    </div>
  );
}