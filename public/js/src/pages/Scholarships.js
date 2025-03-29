// public/js/src/pages/Scholarships.js
import React, { useState, useEffect } from 'react';
import ScholarshipCard from '../components/ScholarshipCard'; // Import ScholarshipCard component

function Scholarships() {
    const [scholarships, setScholarships] = useState([]); // State for scholarships data
    const [loading, setLoading] = useState(true);       // Loading state
    const [error, setError] = useState(null);         // Error state
    const [degreeLevelFilter, setDegreeLevelFilter] = useState(null); // State for degree level filter

    useEffect(() => {
        fetchScholarships(); // Fetch scholarships data on component mount and filter change
    }, [degreeLevelFilter]); // Re-fetch when degreeLevelFilter changes

    const fetchScholarships = () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams(); // Use URLSearchParams to build query parameters
        if (degreeLevelFilter) {
            params.append('degreeLevel', degreeLevelFilter); // Add degreeLevel filter if selected
        }

        const apiUrl = `/wp-json/student-portal/v1/scholarships?${params.toString()}`; // Append query parameters to API URL


        fetch(apiUrl, { // Fetch data from API
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch scholarships: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setScholarships(data); // Update scholarships state with fetched data
            setLoading(false);     // Set loading to false after successful fetch
        })
        .catch(error => {
            console.error("Error fetching scholarships:", error);
            setError(error);        // Set error state
            setLoading(false);     // Set loading to false even on error
        });
    };


    const handleDegreeLevelFilter = (level) => {
        setDegreeLevelFilter(level); // Update degreeLevelFilter state when filter button is clicked
    };


    return (
        <div className="scholarships-page">
            <h2>Scholarships</h2>

            {/* Degree Level Filters */}
            <div className="degree-level-filters">
                <button className={`degree-level-filter-button ${!degreeLevelFilter ? 'active' : ''}`} onClick={() => handleDegreeLevelFilter(null)}>All</button>
                <button className={`degree-level-filter-button ${degreeLevelFilter === 'associate' ? 'active' : ''}`} onClick={() => handleDegreeLevelFilter('associate')}>Associate Degree</button>
                <button className={`degree-level-filter-button ${degreeLevelFilter === 'bachelor' ? 'active' : ''}`} onClick={() => handleDegreeLevelFilter('bachelor')}>Bachelor's Degree</button>
                <button className={`degree-level-filter-button ${degreeLevelFilter === 'master' ? 'active' : ''}`} onClick={() => handleDegreeLevelFilter('master')}>Master's Degree</button>
                <button className={`degree-level-filter-button ${degreeLevelFilter === 'doctorate' ? 'active' : ''}`} onClick={() => handleDegreeLevelFilter('doctorate')}>Doctorate</button>
            </div>


            {error && <div className="error-message api-error">Error: {error.message}</div>} {/* Display error message */}
            {loading && <p>Loading scholarships...</p>} {/* Display loading message */}

            {!loading && !error && ( // Conditionally render scholarship cards when not loading and no error
                <div className="scholarship-list">
                    {scholarships.map(scholarship => (
                        <ScholarshipCard key={scholarship.scholarship_id} scholarship={scholarship} /> // Render ScholarshipCard for each scholarship
                    ))}
                </div>
            )}
        </div>
    );
}

export default Scholarships;