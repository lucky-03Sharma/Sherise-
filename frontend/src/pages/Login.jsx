import { useState, useEffect } from "react";
import API from "../services/api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/login.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(location.state?.message || "");
  const [showPopup, setShowPopup] = useState(!!location.state?.message);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      setShowPopup(true);
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      if (res.data.name) {
        localStorage.setItem("name", res.data.name);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setMessage(
        getApiErrorMessage(err, "Login failed. Please check your credentials.")
      );
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card shadow-lg login-card">
                <div className="card-body">
                  <h2 className="text-center mb-4">Login</h2>

                  <form onSubmit={handleLogin}>
                    <input
                      type="email"
                      className="form-control mb-3"
                      placeholder="Email"
                      value={form.email}
                      disabled={loading}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />

                    <input
                      type="password"
                      className="form-control mb-3"
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
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </form>

                  {showPopup && (
                    <div
                      className={`alert mt-3 ${
                        message.includes("successful") ? "alert-success" : "alert-danger"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <p className="text-center mt-3">
                    Don't have an account?{" "}
                    <Link to="/register">Register here</Link>
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
