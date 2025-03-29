import React, { useState, useMemo } from 'react';


function ApplicationTable({ applications }) {
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const sortedApplications = useMemo(() => {
        if (!sortBy) return applications;

        return [...applications].sort((a, b) => {
            let comparison = 0;

            if (sortBy === 'applicationNo') {
                const appNoA = parseInt(a.applicationNo.substring(3), 10);
                const appNoB = parseInt(b.applicationNo.substring(3), 10);
                comparison = appNoA - appNoB;
            } else if (sortBy === 'scholarshipType') {
                comparison = a.scholarshipType.localeCompare(b.scholarshipType);
            } else if (sortBy === 'term') {
                comparison = a.term.localeCompare(b.term);
            }

            return sortOrder === 'asc' ? comparison : comparison * -1;
        });
    }, [applications, sortBy, sortOrder]);

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(columnName);
            setSortOrder('asc');
        }
    };

    const getSortIndicator = (columnName) => {
        if (sortBy === columnName) {
            return sortOrder === 'asc' ? ' ↑' : ' ↓';
        }
        return '';
    };

    return (
        <div className="application-table">
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('applicationNo')}>
                            Application No{getSortIndicator('applicationNo')}
                        </th>
                        <th onClick={() => handleSort('scholarshipType')}>
                            Scholarship Type{getSortIndicator('scholarshipType')}
                        </th>
                        <th onClick={() => handleSort('term')}>
                            Term{getSortIndicator('term')}
                        </th>
                        <th>Applied Degree</th>
                        <th>Results</th>
                        <th>Status</th>
                        <th>Note</th>
                        <th>Application Report</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedApplications.map((application, index) => (
                        <tr key={index}>
                            <td>
                                {application.hasNotification && (
                                    <span className="notification-icon"></span>
                                )}
                                {application.applicationNo}
                            </td>
                            <td>{application.scholarshipType}</td>
                            <td>{application.term}</td>
                            <td>{application.appliedDegree}</td>
                            <td>
                                <span className="status-badge">{application.results}</span>
                            </td>
                            <td>
                                <span className="status-badge">{application.status}</span>
                            </td>
                            <td>
                                {application.hasNotification ? (
                                    <div className="notification-message">
                                        <span className="notification-badge"></span>
                                        Notification
                                    </div>
                                ) : (
                                    application.note
                                )}
                            </td>
                            <td>
                                <a href={application.applicationReportUrl} className="download-button">
                                    Download
                                    <span className="download-icon"></span>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ApplicationTable;