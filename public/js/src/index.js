import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'; 
import { AnimatePresence, motion } from 'framer-motion'; // Import AnimatePresence and motion

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute component
import Login from './pages/Login'; // Import Login page
import Registration from './pages/Registration';
import MyApplications from './pages/MyApplications';
import Scholarships from './pages/Scholarships';
import MyBackground from './pages/MyBackground';
import CareerTest from './pages/CareerTest';
import Payment from './pages/Payment'; 
import Test from './pages/Test';
import Support from './pages/Support'; // Placeholder for Support
import Profile from './pages/Profile'; // Placeholder for Profile
import ScholarshipDetails from './components/ScholarshipDetails';

function App() {
  const location = useLocation(); // Get location here to pass key to Routes

  return (
    <AnimatePresence mode="wait"> 
      <Routes location={location} key={location.pathname}> 
        {/* Public Routes - Outside AppLayout */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Protected Routes - Inside AppLayout */}
        <Route path="/*" element={<AppLayout />} /> 
      </Routes>
    </AnimatePresence>
  );
}

// Wrap the return of App with Router to provide context for useLocation
function RootApp() {
  return (
    <Router basename="/student-portal">
      <App />
    </Router>
  );
}

function AppLayout() {
    const [data, setData] = useState({
        personalData: null,
        familyData: null,
        contactData: null,
        educationData: null,
        languageData: null,
        academicData: null,
        workExperienceData: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("studentPortalToken");

                const endpoints = [
                    "personal", "family", "contact", "education",
                    "language", "academic", "work-experience"
                ];
                
                const responses = await Promise.all(
                    endpoints.map(endpoint =>
                        fetch(`/wp-json/student-portal/v1/my-background/${endpoint}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    )
                );

                const results = await Promise.all(responses.map(res => res.json()));

                setData({
                    personalData: results[0],
                    familyData: results[1],
                    contactData: results[2],
                    educationData: results[3],
                    languageData: results[4],
                    academicData: results[5],
                    workExperienceData: results[6],
                });

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const location = useLocation();

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-area">
                <Header />
                <div className="main-content">
                    <Routes location={location} key={location.pathname + '-applayout'}>
                        <Route path="/scholarships" element={<PrivateRoute><Scholarships /></PrivateRoute>} />
                        <Route path="/scholarships/:scholarshipId" element={<PrivateRoute><ScholarshipDetails /></PrivateRoute>} /> 
                        <Route path="/my-applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />
                        <Route path="/my-background" element={<PrivateRoute><MyBackground {...data} /></PrivateRoute>} />
                        <Route path="/career-test" element={<PrivateRoute><CareerTest /></PrivateRoute>} />
                        <Route path="/career-test/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
                        <Route path="/career-test/test-taking" element={<PrivateRoute><Test /></PrivateRoute>} />
                        <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="/" element={<PrivateRoute><Navigate to="/scholarships" replace /></PrivateRoute>} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('student-portal-root'));
root.render(<RootApp />);
