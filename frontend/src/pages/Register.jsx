import { useState, useEffect } from "react";
import API from "../services/api";
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

  const navigate = useNavigate();

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleRegister = async () => {

    if (!form.name || !form.email || !form.password) {
      setMessage("Please enter the credentials");
      setShowPopup(true);
      return;
    }

    try {

      await API.post("/auth/register", form);

      setMessage("Registration successful!");
      setShowPopup(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      console.log("Register error:", err);

      setMessage(
        err.response?.data?.message ||
        "Registration failed. Email may already be in use."
      );

      setShowPopup(true);
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

                  <h2 className="text-center mb-4">
                    Register
                  </h2>

                  <input
                    className="form-control mb-3"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    className="form-control mb-3"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                  />

                  <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                  />

                  <button
                    className="btn btn-primary w-100"
                    onClick={handleRegister}
                  >
                    Register
                  </button>

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
                    <Link to="/login">
                      Login here
                    </Link>
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