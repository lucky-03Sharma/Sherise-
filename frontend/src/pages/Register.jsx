import { useState } from "react";
import API from "../services/api";
import "../css/Register.css";
import { Link, useNavigate } from "react-router-dom";

export default function Register(){
    const [form , setForm] = useState({name: "", email: "", password:"" , });
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await API.post("/auth/register", form);
            alert(res.data.message || "Registration successful!");
            navigate("/login");
        } catch (err) {
            console.log("Register error:", err);
            alert("Registration failed. Email may already be in use.");
        }
    };

    return (
    <div className="register-page">

<div className="container">

<div className="row justify-content-center">

<div className="col-md-5">

<div className="card shadow-lg register-card">

<div className="card-body">
      <h2 className="text-center mb-4">Register</h2>
      <input className="form-control mb-3" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input className="form-control mb-3" placeholder="Email"  value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input className="form-control mb-3" type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <button className="btn btn-primary w-100" onClick={handleRegister}>Register</button>
      <p>Already have an account? <Link to="/login">Login here</Link></p>

    </div>

</div>

</div>

</div>

</div>

</div>

);
}
