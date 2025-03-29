import React from 'react';
import { ChevronDown, LogOut, User, Settings } from 'react-feather';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import NotificationIcon from './NotificationIcon'; // Import the component we created
import UserAvatar from './UserAvatar'; // Import the component we created

function Header() {
    const navigate = useNavigate(); // Hook for navigation

    // For demo purposes
    const notificationCount = 2;
    const userAvatarSrc = null; // Set to null to show fallback, or provide a URL for an image

    // Logout function
    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem("studentPortalToken");

        // Redirect to login page
        navigate("/login");
    };

    return (
        <header className="app-header">
            <div className="header-inner">
                <h1>&nbsp;</h1>
                <div className="header-actions">
                    <NotificationIcon count={notificationCount} />
                    <div className="user-profile-dropdown">
                        <UserAvatar src={userAvatarSrc} alt="John Doe" />
                        <span>John Doe</span>
                        <ChevronDown size={16} />
                        <div className="dropdown-content">
                            <ul>
                                <li>
                                    <a href="#">
                                        <User size={16} />
                                        Profile
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <Settings size={16} />
                                        Settings
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={handleLogout}>
                                        <LogOut size={16} />
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
