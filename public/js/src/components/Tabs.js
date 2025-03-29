import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  User, 
  Users, 
  PhoneCall, 
  BookOpen, 
  Globe, 
  Award, 
  Briefcase 
} from 'react-feather';

function Tabs({ children }) {
  // Get and set query params from URL
  const [searchParams, setSearchParams] = useSearchParams();
  // Determine initial tab from URL, fallback to first tab's label if not specified
  const initialTab = searchParams.get("tab") || children[0].props.label;
  const [activeTab, setActiveTab] = useState(initialTab);

  // When the URL parameter changes externally (e.g., via browser back/forward),
  // update the active tab accordingly.
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || children[0].props.label;
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, children, activeTab]);

  const handleClickTab = (label) => {
    setActiveTab(label);
    // Push a new history entry by updating the query parameter.
    setSearchParams({ tab: label });
  };

  // Map tab labels to their corresponding icons
  const getTabIcon = (label) => {
    switch(label) {
      case 'Personal':
        return <User size={16} />;
      case 'Family':
        return <Users size={16} />;
      case 'Contact':
        return <PhoneCall size={16} />;
      case 'Education':
        return <BookOpen size={16} />;
      case 'Language':
        return <Globe size={16} />;
      case 'Academic Qualification':
        return <Award size={16} />;
      case 'Work Experience':
        return <Briefcase size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="tabs-component">
      <ul className="tabs-header">
        {children.map((child) => (
          <li
            key={child.props.label}
            className={`tab-item ${activeTab === child.props.label ? 'active' : ''}`}
            onClick={() => handleClickTab(child.props.label)}
          >
            {getTabIcon(child.props.label)}
            {child.props.label}
          </li>
        ))}
      </ul>
      <div className="tabs-content">
        {children.map((child) =>
          child.props.label === activeTab ? (
            <div key={child.props.label}>{child}</div>
          ) : null
        )}
      </div>
    </div>
  );
}

function TabPane({ label, children }) {
  return <>{children}</>;
}

Tabs.TabPane = TabPane;

export default Tabs;