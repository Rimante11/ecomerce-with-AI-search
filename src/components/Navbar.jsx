import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
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
        setShowDropdown(false);
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <nav 
            className={`navbar navbar-expand-lg py-3 fixed-top transition-navbar ${
                !isHomePage || scrolled ? 'navbar-scrolled' : 'navbar-transparent'
            }`}
            style={{
                backgroundColor: isHomePage && !scrolled ? 'transparent' : undefined
            }}
        >
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
                            <div 
                                className="d-inline position-relative"
                            >
                                <button
                                    className="btn p-0 text-dark me-2"
                                    style={{ fontSize: '18px', background: 'none', border: 'none' }}
                                    onMouseEnter={() => setShowDropdown(true)}
                                >
                                    <i className="fa fa-user"></i>
                                </button>
                                {showDropdown && (
                                    <div
                                        className="dropdown-menu show"
                                        style={{ position: "absolute", top: "100%", right: 0, zIndex: 1050 }}
                                        onMouseLeave={() => setShowDropdown(false)}
                                    >
                                        <NavLink className="dropdown-item" to="/profile" onClick={() => setShowDropdown(false)}>
                                            <i className="fa fa-user-circle mr-1"></i> Profile
                                        </NavLink>
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

                        {/* Cart Icon */}
                        <NavLink to="/cart" className="text-dark mx-3 position-relative" style={{ fontSize: '20px' }}>
                            <i className="fa fa-shopping-cart"></i>
                            {state.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                                    {state.length}
                                </span>
                            )}
                        </NavLink>
                        
                        {/* User Icon */}
                        {user ? (
                            <div 
                                className="d-inline position-relative"
                            >
                                <button
                                    className="btn p-0 text-dark mx-3 username-button"
                                    style={{ fontSize: '20px', background: 'none', border: 'none' }}
                                    onMouseEnter={() => setShowDropdown(true)}
                                >
                                    {user.name} <i className="fa fa-user"></i>
                                </button>
                                {showDropdown && (
                                    <div
                                        className="dropdown-menu show"
                                        style={{ position: "absolute", top: "100%", left: 0, zIndex: 1050 }}
                                        onMouseLeave={() => setShowDropdown(false)}
                                    >                                            <NavLink className="dropdown-item" to="/profile" onClick={() => setShowDropdown(false)}>
                                                <i className="fa fa-user-circle mr-1"></i> Profile
                                            </NavLink>
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
                        
                    </div>
                </div>
            </div>
        </nav>
    );
};



export default Navbar;