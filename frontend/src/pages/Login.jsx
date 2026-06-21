import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/Login.css";

export default function Login() {

  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(
    location.state?.message || ""
  );

  const [showPopup, setShowPopup] = useState(
    !!location.state?.message
  );

  useEffect(() => {

    if (showPopup) {

      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);

    }

  }, [showPopup]);

  const handleLogin = async () => {

    if (!form.email || !form.password) {

      setMessage("Please fill in all fields.");
      setShowPopup(true);

      return;
    }

    try {

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      setMessage("Please check your credentials and try again.");
      setShowPopup(true);

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

                  <h2 className="text-center mb-4">
                    Login
                  </h2>

                  <input
                    type="email"
                    className="form-control mb-3"
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
                    type="password"
                    className="form-control mb-3"
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
                    onClick={handleLogin}
                  >
                    Login
                  </button>

                  {showPopup && (
                    <div className="alert alert-danger mt-3">
                      {message}
                    </div>
                  )}

                  <p className="text-center mt-3">
                    Don't have an account?{" "}
                    <Link to="/register">
                      Register here
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