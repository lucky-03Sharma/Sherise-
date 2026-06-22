import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBars } from "@fortawesome/free-solid-svg-icons";

import "../css/Navbar.css";

export default function Navbar() {

const [isMenuOpen, setIsMenuOpen] = useState(false);

const navigate = useNavigate();

const token = localStorage.getItem("token");

const logout = () => {

localStorage.removeItem("token");

navigate("/");

};

return (

<nav className="navbar">

<h2 className="logo">SheRise</h2>

<div

className="menu-icon"

onClick={() => setIsMenuOpen(!isMenuOpen)}

>

<FontAwesomeIcon icon={faBars} size="2x" />

</div>

{isMenuOpen && (

<div className="sherise-dropdown">

<Link to="/">Home</Link>

{!token ? (

<>

<Link to="/login">Login</Link>

<Link to="/register">Register</Link>

</>

) : (

<>

<Link to="/dashboard">Dashboard</Link>

<Link to="/complaints">Complaints</Link>

<Link to="/therapy">Therapy</Link>

<Link to="/consultation">Consultation</Link>

<Link to="/helplines">Helplines</Link>

<button className="logout-btn" onClick={logout}>

Logout

</button>

</>

)}

</div>

)}

</nav>

);

}