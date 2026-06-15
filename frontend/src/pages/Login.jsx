import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);
      console.log(err.message);

      alert("Login failed");
    }
  }

  return (
    <div className="login-page">

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-md-5">

            <div className="card shadow-lg login-card">

              <div className="card-body">

                <h2 className="text-center mb-4">Login</h2>

                <input
                  className="form-control mb-3"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />

                <input
                  className="form-control mb-3"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
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
                  <Link to="/register">Register here</Link>
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}