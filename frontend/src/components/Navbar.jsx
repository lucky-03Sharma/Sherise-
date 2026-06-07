import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
    return (
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span><b>SheRise</b></span>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/complaints")}>Complaints</button>
            <button onClick={() => navigate("/therapy")}>Therapy</button>
            <button onClick={() => navigate("/consultation")}>Consultation</button>
            <button onClick={() => navigate("/helplines")}>Helplines</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}