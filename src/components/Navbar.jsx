import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../styles/layout.css";

const Navbar = () => {
    const state = useSelector(state => state.handleCart);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if we're on the home page
    const isHomePage = location.pathname === '/';

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        let email = null;
        if (userData) {
            try {
                email = JSON.parse(userData).email;
            } catch {}
        }
        if (email) {
            fetch(`/api/auth/user/${email}`)
                .then(res => res.json())
                .then(data => {
                    if (data.name && data.email) {
                        setUser({ name: data.name, email: data.email });
                    } else {
                        setUser(null);
                    }
                })
                .catch(() => setUser(null));
        } else {
            setUser(null);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className={`navbar navbar-expand-lg py-3 fixed-top transition-navbar ${
            !isHomePage || scrolled ? 'navbar-scrolled' : 'navbar-transparent'
        }`}>
            <div className="container">
                {/* Mobile brand on left side */}
                <NavLink className="navbar-brand fw-bold fs-4 px-2 d-lg-none mobile-brand" to="/"> Artlister</NavLink>

                {/* Mobile right section with icons and hamburger */}
                <div className="d-flex align-items-center d-lg-none mobile-right-section">
                    {/* Mobile Icons */}
                    <div className="d-flex align-items-center mobile-icons me-3">
                        {/* Search Icon */}
                        <NavLink to="/search" className="text-dark me-2" style={{ fontSize: '18px' }}>
                            <i className="fa fa-search"></i>
                        </NavLink>
                        
                        {/* User Icon */}
                        {user ? (
                            <div className="d-inline position-relative">
                                <button
                                    className="btn p-0 text-dark me-2"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    style={{ fontSize: '18px', background: 'none', border: 'none' }}
                                >
                                    <i className="fa fa-user"></i>
                                </button>
                                {showDropdown && (
                                    <div
                                        className="dropdown-menu show"
                                        style={{ position: "absolute", top: "100%", right: 0 }}
                                    >
                                        <span className="dropdown-item-text">{user.name}</span>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            <i className="fa fa-sign-out-alt mr-1"></i> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink to="/login" className="text-dark me-2" style={{ fontSize: '18px' }}>
                                <i className="fa fa-user"></i>
                            </NavLink>
                        )}
                        
                        {/* Cart Icon */}
                        <NavLink to="/cart" className="text-dark position-relative me-2" style={{ fontSize: '18px' }}>
                            <i className="fa fa-shopping-cart"></i>
                            {state.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '8px' }}>
                                    {state.length}
                                </span>
                            )}
                        </NavLink>
                    </div>
                    
                    {/* Hamburger Menu */}
                    <button className="navbar-toggler hamburger-manu-wrapper" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                {/* Desktop brand (hidden on mobile) */}
                <NavLink className="navbar-brand fw-bold fs-4 px-2 d-none d-lg-block" to="/"> Artlister</NavLink>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    {/* Desktop Icons - Hidden on mobile */}
                    <div className="d-none d-lg-flex align-items-center">
                        {/* Search Icon */}
                        <NavLink to="/search" className="text-dark mx-3" style={{ fontSize: '20px' }}>
                            <i className="fa fa-search"></i>
                        </NavLink>
                        
                        {/* User Icon */}
                        {user ? (
                            <div className="d-inline position-relative">
                                <button
                                    className="btn p-0 text-dark mx-3"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    style={{ fontSize: '20px', background: 'none', border: 'none' }}
                                >
                                    <i className="fa fa-user"></i>
                                </button>
                                {showDropdown && (
                                    <div
                                        className="dropdown-menu show"
                                        style={{ position: "absolute", top: "100%", left: 0 }}
                                    >
                                        <span className="dropdown-item-text">{user.name}</span>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            <i className="fa fa-sign-out-alt mr-1"></i> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink to="/login" className="text-dark mx-3" style={{ fontSize: '20px' }}>
                                <i className="fa fa-user"></i>
                            </NavLink>
                        )}
                        
                        {/* Cart Icon */}
                        <NavLink to="/cart" className="text-dark mx-3 position-relative" style={{ fontSize: '20px' }}>
                            <i className="fa fa-shopping-cart"></i>
                            {state.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                                    {state.length}
                                </span>
                            )}
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};


// Custom dropdown, active nav, and scroll CSS
const style = document.createElement('style');
style.innerHTML = `
    .dropdown-menu.show {
        display: block;
        margin-top: 12px;
        margin-left: 5px;
    }
    
    .active-nav-link {
        text-decoration: underline !important;
        text-underline-offset: 4px;
        text-decoration-thickness: 2px;
        font-weight: 600;
    }
    
    .transition-navbar {
        transition: all 0.4s ease-in-out;
        z-index: 1000;
    }
    
    .navbar-transparent {
        background-color: transparent !important;
        backdrop-filter: none;
    }
    
    .navbar-transparent .navbar-brand,
    .navbar-transparent .nav-link,
    .navbar-transparent .text-dark {
        color: white !important;
    }
    
    .navbar-scrolled {
        background-color: rgba(248, 249, 250, 0.95) !important;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .navbar-scrolled .navbar-brand,
    .navbar-scrolled .nav-link,
    .navbar-scrolled .text-dark {
        color: #333 !important;
    }
    
    /* Ensure the main content starts below the navbar */
    body {
        padding-top: 80px;
    }
    
    /* Mobile navbar layout */
    @media (max-width: 991px) {
        .container {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 20px;
            padding-right: 20px;
        }
        
        .mobile-brand {
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .mobile-right-section {
            display: flex;
            align-items: center;
            z-index: 10;
        }
        
        .mobile-icons {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        /* Ensure mobile icons have proper color inheritance */
        .mobile-icons .text-dark {
            color: inherit !important;
        }
        
        .navbar-transparent .mobile-icons .text-dark {
            color: white !important;
        }
        
        .navbar-scrolled .mobile-icons .text-dark {
            color: #333 !important;
        }
        
        /* Make sure hamburger button colors are inherited properly */
        .navbar-transparent .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }
        
        .navbar-scrolled .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2833, 37, 41, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }
    }
    
    /* Extra padding for very small screens */
    @media (max-width: 576px) {
        .container {
            padding-left: 15px !important;
            padding-right: 15px !important;
        }
    }
`;
document.head.appendChild(style);

export default Navbar;