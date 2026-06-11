import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import Helplines from "./pages/Helplines";
import Consultation from "./pages/Consultation";
import Therapy from "./pages/Therapy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/helplines" element={<Helplines />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/therapy" element={<Therapy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;