import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

function ScholarshipDetails() {
    const { scholarshipId } = useParams();
    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplying, setIsApplying] = useState(false); // Track application state
    const [message, setMessage] = useState(null); // Store success/error messages

    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/wp-json/student-portal/v1/scholarships/${scholarshipId}`);
                if (!response.ok) throw new Error(`Failed to fetch scholarship details: ${response.status}`);
                const data = await response.json();
                setScholarship(data);
            } catch (error) {
                console.error("Error fetching scholarship details:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarshipDetails();
    }, [scholarshipId]);

    const handleApplyScholarship = useCallback(async () => {
        setIsApplying(true);
        setMessage(null);

        try {
            const response = await fetch('/wp-json/student-portal/v1/apply-scholarship', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('studentPortalToken')}`,
                },
                body: JSON.stringify({ scholarshipId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Application failed');
            }

            const data = await response.json();
            setMessage({ type: 'success', text: "Application submitted successfully!" });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
            console.error("Error submitting application:", error);
        } finally {
            setIsApplying(false);
        }
    }, [scholarshipId]);

    if (loading) return <p>Loading scholarship details...</p>;
    if (error) return <div className="error-message api-error">Error: {error.message}</div>;
    if (!scholarship) return <p>Scholarship not found.</p>;

    return (
        <div className="scholarship-details-page">
            <h2>{scholarship.scholarship_name}</h2>
            <div className="scholarship-funding">
                Funding: {scholarship.funding_type} {scholarship.coverage_percentage && `(Up to ${scholarship.coverage_percentage}%)`}
            </div>
            <div className="scholarship-intake">Intake Year: {scholarship.intake_year}</div>
            <div className="scholarship-deadline">Application Deadline: {scholarship.application_end_date}</div>

            <div className="scholarship-description">
                <h3>Description</h3>
                <p>{scholarship.description}</p>
            </div>

            <div className="scholarship-eligibility">
                <h3>Eligibility Criteria</h3>
                <p>{scholarship.eligibility_criteria}</p>
            </div>

            <div className="scholarship-instructions">
                <h3>Application Instructions</h3>
                <p>{scholarship.application_instructions}</p>
            </div>

            {message && (
                <div className={`message-box ${message.type === 'error' ? 'error' : 'success'}`}>
                    {message.text}
                </div>
            )}

            <div className="scholarship-actions">
                <button 
                    className="apply-button" 
                    onClick={handleApplyScholarship} 
                    disabled={isApplying}
                >
                    {isApplying ? "Applying..." : "Apply Now →"}
                </button>
            </div>
        </div>
    );
}

export default ScholarshipDetails;
