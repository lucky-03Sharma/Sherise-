import {useState} from "react";
import API from "../services/api";
import {useNavigate} from "react-router-dom";

export default function register(){
    const [from , setForm] = useState({name: "", password:""});
    const navigate = useNavigate();

    const handleRegister = async () => {
        await API.post("/auth/register" , form);
        navigate("/");
    };

    return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
