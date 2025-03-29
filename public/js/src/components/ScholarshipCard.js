// public/js/src/components/ScholarshipCard.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

function ScholarshipCard({ scholarship }) {
    return (
        <div className="scholarship-card">
            <div className="card-header">
                <h3 className="scholarship-name">{scholarship.scholarship_name}</h3>
                <span className="funding-badge">{scholarship.funding_type}</span>
            </div>
            <div className="card-body">
                <p className="description">{scholarship.description}</p>
                <div className="details">
                    <span className="intake">
                        <i className="fas fa-calendar"></i> 2025 Intake
                    </span>
                    <span className="deadline">
                        FROM 30 OCT TO 20 SEP
                    </span>
                </div>
                <div className="eligibility">
                    <i className="fas fa-info-circle"></i> Scholarship Eligibility
                </div>
            </div>
            <div className="card-footer">
                {/* **Use Link to navigate to Scholarship Details page** */}
                <Link to={`/scholarships/${scholarship.scholarship_id}`} className="apply-button">Apply Now →</Link>
            </div>
        </div>
    );
}

export default ScholarshipCard;