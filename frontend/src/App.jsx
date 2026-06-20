import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import Helplines from "./pages/Helplines";
import Consultation from "./pages/Consultation";
import Therapy from "./pages/Therapy";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/complaints" element={
          <ProtectedRoute>
            <Complaints />
          </ProtectedRoute>
        } />
        <Route path="/helplines" element={
          <ProtectedRoute>
            <Helplines />
          </ProtectedRoute>
        } />
        <Route path="/consultation" element={
          <ProtectedRoute>
            <Consultation />
          </ProtectedRoute>
        } />
        <Route path="/therapy" element={
          <ProtectedRoute>
            <Therapy />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;