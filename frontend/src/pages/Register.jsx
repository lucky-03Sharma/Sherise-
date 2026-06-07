import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register(){
    const [form , setForm] = useState({name: "", email: "", password:"" , });
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await API.post("/auth/register", form);
            navigate("/");
        } catch (err) {
            console.log("Register error:", err);
            alert("Registration failed. Email may already be in use.");
        }
    };

    return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <button onClick={handleRegister}>Register</button>
      <p>Already have an account? <Link to="/">Login here</Link></p>
    </div>
  );
}
