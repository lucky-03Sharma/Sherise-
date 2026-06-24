import { useState, useEffect } from "react";
import API from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import "../css/Register.css";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!name || !email || !password) {
      setMessage("Please fill in all fields.");
      setShowPopup(true);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setShowPopup(true);
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/register", { name, email, password });

      setMessage("Registration successful!");
      setShowPopup(true);

      setTimeout(() => {
        navigate("/login", { state: { message: "Registration successful. Please log in." } });
      }, 500);
    } catch (err) {
      console.error("Register error:", err);

      setMessage(
        getApiErrorMessage(err, "Registration failed. Please try again.")
      );
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="register-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card shadow-lg register-card">
                <div className="card-body">
                  <h2 className="text-center mb-4">Register</h2>

                  <form onSubmit={handleRegister}>
                    <input
                      className="form-control mb-3"
                      placeholder="Name"
                      value={form.name}
                      disabled={loading}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />

                    <input
                      className="form-control mb-3"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      disabled={loading}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />

                    <input
                      className="form-control mb-3"
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      disabled={loading}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </form>

                  {showPopup && (
                    <div
                      className={`alert mt-3 ${
                        message.includes("successful")
                          ? "alert-success"
                          : "alert-danger"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <p className="text-center mt-3">
                    Already have an account?{" "}
                    <Link to="/login">Login here</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
