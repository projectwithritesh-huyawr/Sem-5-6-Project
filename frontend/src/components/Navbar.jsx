import { Link } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="brand-title">
        <span>LIBRARY</span>
        <span>MANAGEMENT</span>
        <span>SYSTEM</span>
      </h2>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/login">Login</Link></li>
       <li> <Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;