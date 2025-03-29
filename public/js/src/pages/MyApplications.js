import React, { useState, useEffect } from 'react';
import ApplicationTable from '../components/ApplicationTable';

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScholarshipInfoMessage, setShowScholarshipInfoMessage] = useState(false);
    const [filterScholarshipType, setFilterScholarshipType] = useState('');
    const [sortBy, setSortBy] = useState(null);       // **New state for sort column**
    const [sortOrder, setSortOrder] = useState('asc'); // **New state for sort order**


    useEffect(() => {
        fetchApplications();
    }, [filterScholarshipType, sortBy, sortOrder]); // Re-fetch on filter or sort change

    const fetchApplications = () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filterScholarshipType) {
            params.append('scholarshipType', filterScholarshipType);
        }
        if (sortBy) {
            params.append('sortBy', sortBy);       // Add sortBy parameter
            params.append('sortOrder', sortOrder); // Add sortOrder parameter
        }

        const apiUrl = `/wp-json/student-portal/v1/my-applications?${params.toString()}`;

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('studentPortalToken')}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch applications: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setApplications(data.applications);
            setLoading(false);
            setShowScholarshipInfoMessage(data.needsCareerConsulting);
        })
        .catch(error => {
            console.error("Error fetching applications:", error);
            setError(error);
            setLoading(false);
        });
    };

    const handleFilterChange = (e) => {
        setFilterScholarshipType(e.target.value);
    };

    const handleSort = (columnName) => { // **New function to handle sorting**
        if (sortBy === columnName) {
            // If sorting on the same column, toggle sort order
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // If sorting on a different column, set new sort column and default to ascending order
            setSortBy(columnName);
            setSortOrder('asc');
        }
    };


 return (
        <div className="my-applications-page">
            <h2>My Applications</h2>
            <p>You can view or update your personal information.</p>

            {showScholarshipInfoMessage && (
                <div className="info-message scholarship-info-message">
                    <i className="info-icon"></i>
                    In order to apply for 100% scholarship, you need to get a &nbsp;<a href="#">career test & consulting</a>&nbsp; from N.C.E!
                </div>
            )}

            <div className="filters">
                <div className="filter-row">
                    <label htmlFor="scholarshipTypeFilter">Filter by Scholarship Type:</label>
                    <select
                        id="scholarshipTypeFilter"
                        name="scholarshipTypeFilter"
                        value={filterScholarshipType}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Scholarship Types</option>
                        <option value="Full Scholarship">Full Scholarship</option>
                        <option value="Merit Based Scholarship">Merit Based Scholarship</option>
                        <option value="Excellence Scholarship">Excellence Scholarship</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-message api-error">Error: {error.message}</div>}
            {loading && <p>Loading applications...</p>}

            {!loading && !error && (
                <ApplicationTable applications={applications} />
            )}
        </div>
    );
}

export default MyApplications;