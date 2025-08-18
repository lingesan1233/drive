import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">N.O.V.A-DRIVE</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <Link to="/upload">Upload</Link>
            <button className="btn-link" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
