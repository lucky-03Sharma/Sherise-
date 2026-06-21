import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace state = {{ message: "Please login to access this page."}} />; 
    }
    return children;
}