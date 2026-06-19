import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/Login.css";

export default function Login() {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message || "Login failed"
      );
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