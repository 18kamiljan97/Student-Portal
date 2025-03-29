import React, { useState, useEffect } from "react";
import { Check } from "react-feather";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SkeletonLoaderCareer from "../components/SkeletonLoaderCareer";

function CareerTest({ careerTestId }) {
  // Receive careerTestId as a prop
  const [careerTestData, setCareerTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Get navigate function

  useEffect(() => {
    const fetchCareerTestData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "/wp-json/student-portal/v1/career-tests/active"
        ); // Adjust endpoint if needed
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCareerTestData(data);
      } catch (error) {
        console.error("Could not fetch career test data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareerTestData();
  }, []);

  const handleProceedToPayment = () => {
    navigate("payment"); // Navigate to the payment page
  };

  if (loading) return <SkeletonLoaderCareer />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="career-test-page-container">
      <div className="career-test-header">
        <h2 className="career-test-title">
          Career Aptitude Test & Personalized Consultation
        </h2>

        <p className="career-test-description">
          Discover your ideal career path with our comprehensive assessment and
          expert guidance.
        </p>
      </div>
      <div className="career-test-content">
      <div className='test-overview'>
            <div className='overview-stats'>
              <div className='stat-item'>
                <div className='stat-icon'>📊</div>
                <div className='stat-details'>
                  <h3>Comprehensive Analysis</h3>
                  <p>Deep dive into your professional strengths</p>
                </div>
              </div>
              <div className='stat-item'>
                <div className='stat-icon'>🎯</div>
                <div className='stat-details'>
                  <h3>Personalized Insights</h3>
                  <p>Tailored career recommendations</p>
                </div>
              </div>
              <div className='stat-item'>
                <div className='stat-icon'>🚀</div>
                <div className='stat-details'>
                  <h3>Growth Potential</h3>
                  <p>Strategic career path mapping</p>
                </div>
              </div>
            </div>
          </div>
        <ul className="career-test-features">
        <h4 className="item-no">What You'll Receive</h4>
          <li className="feature-item">
            <Check size={20} />
            Comprehensive aptitude assessment based on your skills, interests,
            and personality.
          </li>
          <li className="feature-item">
            <Check size={20} />
            Personalized report highlighting your top career matches and
            potential growth paths.
          </li>
          <li className="feature-item">
            <Check size={20} />
            Expert consultation to discuss your results and answer your career
            questions.
          </li>
          <li className="feature-item">
            <Check size={20} />
            Actionable insights and recommendations tailored to your unique
            profile.
          </li>
        </ul>

        <div className="price-section">
          <p className="price">
            ${careerTestData.price || "19.99"}{" "}
            <span className="payment-note">
              One-time payment for test and consultation
            </span>
          </p>
        </div>

        <button className="proceed-button" onClick={handleProceedToPayment}>
          Proceed to Payment
        </button>
      </div>
      <div className="career-test-footer">
        <p className="guarantee-text">
          Your satisfaction is guaranteed. If you're not completely satisfied
          with your results, contact us within 30 days for a full refund.
        </p>
      </div>
      <style jsx>{`
        h2.career-test-title {
            font-size: 26px;
            font-weight: 500;
        }
        .career-test-page-container {
          max-width: 100%;
          color: #333;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
        }
        .item-no {
            font-size:16px;
            font-weight:500;
            margin-bottom:15px;
        }
        .career-test-header {
          padding: 35px;
          border-bottom: solid 1px #eaedf3;
        }

        .career-test-content {
          padding: 35px;
        }
        .career-test-footer {
          padding: 35px;
          border-top: solid 1px #eaedf3;
        }
        .career-test-header h1 {
          color: #333;
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .career-test-description {
          color: #666;
          font-size: 16px;
        }

        ul.career-test-features {
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 35px;
          border: solid 1px #eaeaea;
        }

        .overview-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 26px;
            margin-bottom: 32px;
          }
          
          .stat-item {
            display: flex;
            align-items: center;
            background-color:#f7f7f7;
            border-radius: 12px;
            padding: 16px;
          }
          
          .stat-icon {
            font-size: 32px;
            margin-right: 16px;
          }
          
          .stat-details h3 {
            margin: 0;
            font-size: 16px;
            color: var(--text-dark);
          }
          
          .stat-details p {
            margin: 4px 0 0;
            font-size: 12px;
            color: var(--text-light);
          }
          
        .feature-item {
          font-size: 16px;
          display: flex;
          gap: 7px;
          align-items: center;
          margin-bottom: 10px;
          color: #555;
          font-weight: 300;
        }

        .price-section {
          display: flex;
          align-items: baseline;
          margin-bottom: 20px;
        }

        .price {
          font-size: 1.75rem;
          font-weight: bold;
          color: #333;
          margin-right: 10px;
        }

        .payment-note {
          font-size: 14px;
          font-weight: 300;
          color: #a5a5a5;
        }

        .proceed-button {
          background-color: #1a5fd3;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .proceed-button:hover {
          background-color: #1448a3 ;
        }

        .guarantee-text {
          text-align: start;
          color: #8c8c8c;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

export default CareerTest;
