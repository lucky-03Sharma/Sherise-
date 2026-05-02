import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Helplines() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHelplines = async () => {
      try {
        const res = await API.get("/helplines");
        setData(res.data || []);
      } catch (err) {
        console.log("Error fetching helplines:", err);
      }
    };

    fetchHelplines();
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Helplines</h2>

      {data.length === 0 ? (
        <p>No helplines available</p>
      ) : (
        data.map((h, i) => (
          <div key={i} style={{ border: "1px solid", padding: "10px", margin: "10px" }}>
            <h4>{h.name}</h4>
            <p>{h.phone}</p>
            <p>{h.category}</p>
          </div>
        ))
      )}
    </div>
  );
}