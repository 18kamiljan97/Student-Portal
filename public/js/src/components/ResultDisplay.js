import React from 'react';
import './ResultDisplayPage.css'; // Create CSS file in the next step

function ResultDisplayPage() {
    // In a real implementation, you would receive report data as props or fetch it from an API

    const sampleReportData = { // **Placeholder sample report data - replace with actual data**
        user_info: { name: "John Doe", email: "john.doe@example.com", date: "2025-03-21" },
        riasec_scores: { R: 25, I: 30, A: 35, S: 40, E: 20, C: 15 }, // Example scores
        top_riasec_codes: ["S", "A"],
        promising_riasec_codes: ["I", "R"],
        riasec_definitions: [ // Example definitions - you'll likely fetch these dynamically too
            { riasec_code: "S", short_description: "Helpful and Understanding", long_description: "Social people often see themselves as friendly, helpful, and understanding..." },
            { riasec_code: "A", short_description: "Expressive and Independent", long_description: "Artistic people often see themselves as creative, original, and expressive..." },
            { riasec_code: "I", short_description: "Precise and Intellectual", long_description: "Investigative people see themselves as curious, independent, and good at understanding math and science..." },
            { riasec_code: "R", short_description: "Realistic", long_description: "Realistic people often see themselves as practical, hands-on, and mechanically inclined..." },
        ],
        matching_careers: [ // Example matching careers - replace with dynamic data
            { code: "15-1252.00", title: "Software Developers", description: "Develop, create, and modify general computer applications software or specialized utility programs...", match_type: "thriving" },
            { code: "17-2141.02", title: "Industrial Engineers", description: "Design, develop, test, and evaluate integrated systems for managing industrial production processes...", match_type: "thriving" },
            { code: "25-1042.00", title: "Biological Science Teachers, Postsecondary", description: "Teach courses in biological sciences...", match_type: "promising" },
            { code: "29-1123.00", title: "Dietitians and Nutritionists", description: "Plan and conduct food service or nutritional programs...", match_type: "promising" },
        ],
    };


    return (
        <div className="result-display-page-container">
            <div className="result-display-page">
                <section className="cover-page">
                    <h1 className="report-title">Career Key Discovery</h1>
                    <p className="user-name">Career Profile prepared for:</p>
                    <p className="user-name">{sampleReportData.user_info.name}</p>
                    <p className="user-email">{sampleReportData.user_info.email}</p>
                    <p className="report-date">{sampleReportData.user_info.date}</p>
                    <p className="look-inside-text">Look inside for:</p>
                    <ul className="look-inside-list">
                        <li>Your assessment results</li>
                        <li>Your Profile list of Careers and Majors</li>
                        <li>How to make the best decision for you</li>
                    </ul>
                    <p className="copyright-text">Copyright © 1987-2025, Career Key, Inc. All rights reserved.</p> {/* Update copyright year */}
                    <p className="trademark-text">Career Key is a registered trademark of Career Key, Inc. in the U.S. and other countries.</p>
                </section>

                <section className="personality-summary-section">
                    <h2 className="section-title">Your Personality: {sampleReportData.top_riasec_codes.join(" and ")}</h2> {/* Dynamic top personality types */}
                    <p className="intro-text">Six Types: We look at 6 personality types, giving you a score in each one. <a href="#holland-theory">About Holland's theory</a></p>
                    <p className="intro-text">Your Scores: Scores range from 0 to 33. Higher scores show stronger self-identity to that type. <a href="#about-scores">About the scores</a></p>

                    <div className="thriving-environments">
                        <h3>THRIVING environments</h3>
                        {sampleReportData.top_riasec_codes.map(code => {
                            const definition = sampleReportData.riasec_definitions.find(def => def.riasec_code === code);
                            return definition && (
                                <div key={code} className="riasec-type-summary">
                                    <h4>{sampleReportData.riasec_scores[code]} {code} {definition.short_description}</h4> {/* Dynamic score, code, short description */}
                                    <p>{definition.long_description}</p> {/* Dynamic long description */}
                                    <p>Example Careers: {/* Example careers - will be dynamic */}
                                        {sampleReportData.matching_careers
                                            .filter(career => career.match_type === 'thriving' && career.riasec_codes && career.riasec_codes.includes(code)) // Filter thriving careers matching current RIASEC code (adjust logic as needed)
                                            .slice(0, 3) // Limit to 3 example careers for now
                                            .map(career => career.title)
                                            .join(', ')}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="promising-environments">
                        <h3>PROMISING environments</h3>
                         {sampleReportData.promising_riasec_codes.map(code => {
                            const definition = sampleReportData.riasec_definitions.find(def => def.riasec_code === code);
                            return definition && (
                                <div key={code} className="riasec-type-summary">
                                    <h4>{sampleReportData.riasec_scores[code]} {code} {definition.short_description}</h4> {/* Dynamic score, code, short description */}
                                    <p>{definition.long_description}</p> {/* Dynamic long description */}
                                    <p>Example Careers: {/* Example careers - will be dynamic */}
                                        {sampleReportData.matching_careers
                                            .filter(career => career.match_type === 'promising' && career.riasec_codes && career.riasec_codes.includes(code)) // Filter promising careers matching current RIASEC code (adjust logic as needed)
                                            .slice(0, 3) // Limit to 3 example careers for now
                                            .map(career => career.title)
                                            .join(', ')}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ... (Add more sections like "Strongest personality types", "Realistic", "Social", "About the scores", "Holland's Theory", "Holland Hexagon", "Careers and Majors", "How to Make Good Decisions", "Visit Career Key's library" sections based on the mockup) ... */}

            </div>
        </div>
    );
}

export default ResultDisplayPage;