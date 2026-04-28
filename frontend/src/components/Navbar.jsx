import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
    return (
        <div>
            <span>SheRise</span>
            <button onClick={logout}>Logout</button>
        </div>
    );
}