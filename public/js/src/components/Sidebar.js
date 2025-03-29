import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { 
    Award, 
    FileText, 
    User, 
    CheckCircle, 
    HelpCircle, 
    Settings 
  } from 'react-feather';

function Sidebar() {
    const location = useLocation();
    
    // Helper function to check if the current path starts with a specific route
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };
    
    return (
        <aside className="app-sidebar">
            <div className="logo-area">
                <div className="logo">
                    <img src={logo} alt="Scholarships Logo" />
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li className={isActive("/scholarships") ? "active" : ""}>
                        <Link to="/scholarships">
                            <Award size={18} strokeWidth={1.5} />
                            <span>Scholarships</span>
                        </Link>
                    </li>
                    <li className={isActive("/my-applications") ? "active" : ""}>
                        <Link to="/my-applications">
                            <FileText size={18} strokeWidth={1.5} />
                            <span>My Applications</span>
                        </Link>
                    </li>
                    <li className={isActive("/my-background") ? "active" : ""}>
                        <Link to="/my-background">
                            <User size={18} strokeWidth={1.5} />
                            <span>My Background</span>
                        </Link>
                    </li>
                    <li className={isActive("/career-test") ? "active" : ""}>
                        <Link to="/career-test">
                            <CheckCircle size={18} strokeWidth={1.5} />
                            <span>Career Test</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="support-settings-area">
                <ul>
                    <li className={isActive("/support") ? "active" : ""}>
                        <Link to="/support">
                            <HelpCircle size={18} strokeWidth={1.5} />
                            <span>Support</span>
                        </Link>
                    </li>
                    <li className={isActive("/profile") ? "active" : ""}>
                        <Link to="/profile">
                            <Settings size={18} strokeWidth={1.5} />
                            <span>Settings</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar;