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
    <div className="container mt-4">
      <Navbar />

      <h2 className="text-center mb-4">
        Emergency Helplines
      </h2>

      {data.length === 0 ? (
        <div className="alert alert-warning text-center">
          No helplines available.
        </div>
      ) : (
        <div className="row">
          {data.map((h, i) => (
            <div className="col-md-6 mb-4" key={i}>
              <div className="card shadow h-100">
                <div className="card-body">
                  <h4 className="card-title">{h.name}</h4>

                  <p className="card-text">
                    <strong>Phone:</strong> {h.phone}
                  </p>

                  <p className="card-text">
                    <strong>Category:</strong> {h.category}
                  </p>

                  <a
                    href={`tel:${h.phone}`}
                    className="btn btn-danger"
                  >
                    📞 Call Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}