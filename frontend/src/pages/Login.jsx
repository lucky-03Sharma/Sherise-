import { useState } from "react";
import API from "../services/api";
import { useNavigate , Link} from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "",});
  const navigate = useNavigate();

  const handleLogin = async () => {
   try{
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
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input placeholder="Password" type="password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}