import React from "react";
import { Link } from "react-router-dom";
import "../styles/layout.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-2">
      <div className="container">
        <div className="row align-items-center footer-container">
          <div className="col-md-6">
            <p className="mb-0 footer-text"> © 2025 Artlister</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link 
              to="/privacy-policy" 
              className="footer-link"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
