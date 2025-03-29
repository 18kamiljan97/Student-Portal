import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/auth-tabs.css';

const AuthTabs = ({ onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('registration');
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // Determine active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/login')) {
      setActiveTab('login');
    } else if (path.includes('/registration')) {
      setActiveTab('registration');
    }
  }, [location]);

  // Handle tab change with smooth navigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
        onTabChange(tab); // Notify parent about tab change
    }
    navigate(`/${tab}`);
  };

  return (
    <div className="auth-tabs-container">
      <div className="auth-tabs">
        <div 
          className={`auth-tab ${activeTab === 'registration' ? 'active' : ''}`}
          onClick={() => handleTabChange('registration')}
        >
          registration
        </div>
        <div 
          className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => handleTabChange('login')}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;