import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await API.get("/complaints");
        setComplaints(res.data.complaints || []);
      } catch (err) {
        console.log("Error:", err);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Dashboard</h2>
      <p>Total Complaints: {complaints.length}</p>
    </div>
  );
}