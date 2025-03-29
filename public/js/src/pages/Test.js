import React, { useState, useEffect } from "react";
import SkeletonLoaderTest from "../components/SkeletonLoaderTest";

function Test() {
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const careerTestId = 1;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState("18 minutes");
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false); // New state

  // useEffect to check if all questions are answered
    useEffect(() => {
      if (questionsData && Object.keys(userAnswers).length === questionsData.length) {
        setAllQuestionsAnswered(true);
      } else {
        setAllQuestionsAnswered(false);
      }
    }, [userAnswers, questionsData]);


  const handleAnswerChange = (questionCode, answerValue) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionCode]: answerValue,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSaveLater = async () => {
    setLoading(true);
    setError(null);

    const studentId = localStorage.getItem("studentPortalToken");

    try {
      const response = await fetch(
        `/wp-json/student-portal/v1/career-tests/${careerTestId}/save-progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${studentId}`,
          },
          body: JSON.stringify({
            student_id: studentId,
            action: "save",
            currentQuestionIndex: currentQuestionIndex,
            userAnswers: userAnswers,
          }),
        }
      );

      if (!response.ok) {
        const message = `Error saving progress! Status code: ${response.status}`;
        throw new Error(message);
      }

      const responseData = await response.json();
      alert(responseData.message);
    } catch (error) {
      console.error("Error saving test progress:", error);
      setError(error);
      alert(`Error saving progress: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = async () => {
    // No need to check here, as the submit button only appears when all questions answered
    setLoading(true);
    setError(null);

    const studentId = localStorage.getItem("studentPortalToken");

    try {
      const response = await fetch(
        `/wp-json/student-portal/v1/career-tests/${careerTestId}/save-progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${studentId}`,
          },
          body: JSON.stringify({
            student_id: studentId,
            action: "submit",
            userAnswers: userAnswers,
          }),
        }
      );

      if (!response.ok) {
        const message = `Error submitting test! Status code: ${response.status}`;
        throw new Error(message);
      }

      const responseData = await response.json();
      alert(responseData.message);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
    } catch (error) {
      console.error("Error submitting test:", error);
      setError(error);
      alert(`Error submitting test: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTestQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/wp-json/student-portal/v1/career-tests/${careerTestId}/questions`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestionsData(data);
      } catch (error) {
        console.error("Could not fetch career test questions:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestQuestions();
  }, [careerTestId]);

  if (loading) {
    return <SkeletonLoaderTest />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error fetching career test questions: {error.message}</p>
      </div>
    );
  }

  if (!questionsData || !Array.isArray(questionsData)) {
    return (
      <div className="error-container">
        <p>No career test questions available or invalid data format.</p>
      </div>
    );
  }

  const progressPercentage =
    ((currentQuestionIndex + 1) / questionsData.length) * 100;




  return (
    <div className="test-container">
      <div className="test-content">
        <div className="test-header">
          <h1 className="test-title">Career Aptitude Test</h1>
          <div className="test-info">
            <div className="question-counter">
              Question {currentQuestionIndex + 1} of {questionsData.length}
            </div>
            <div className="time-info">Time remaining: {timeRemaining}</div>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-text">{progressPercentage.toFixed(0)}% Complete</div>
        </div>

        {questionsData.map(
          (question, index) =>
            index === currentQuestionIndex && (
              <div key={question.question_id} className="question-section">
                <p className="question-text">{question.question_text}</p>
                <div className="answer-options">
                  {question.options.map((option) => (
                    <label
                      key={option.option_id}
                      className={`option-card ${
                        userAnswers[question.question_code] === option.option_value
                          ? "selected"
                          : ""
                      }`}
                    >
                      <div className="radio-container">
                        <input
                          type="radio"
                          name={`answer-question-${question.question_code}`}
                          value={option.option_value}
                          checked={userAnswers[question.question_code] === option.option_value}
                          onChange={(e) =>
                            handleAnswerChange(
                              question.question_code,
                              parseInt(e.target.value)
                            )
                          }
                        />
                        <div className="custom-radio"></div>
                      </div>
                      <span className="option-text">{option.option_text}</span>
                    </label>
                  ))}
                </div>
              </div>
            )
        )}

        <div className="test-footer">
          <div className="navigation-buttons">
            <button
              className="previous-button"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            {/* Conditionally render Next or Submit button */}
            {allQuestionsAnswered ? (
              <button className="submit-button" onClick={handleSubmitTest}>
                Submit
              </button>
            ) : (
              <button
                className="next-button"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questionsData.length - 1}
              >
                Next
              </button>
            )}
          </div>

          <div className="tip-container">
            <p className="tip-label">Tip:</p>
            <p className="tip-text">
              Choose the option that best reflects your natural preferences, not what you think would be most impressive to an employer.
            </p>
          </div>

          <button className="save-button" onClick={handleSaveLater}>
            Save and continue later
          </button>
        </div>
      </div>


      <style jsx>{`
        /* Exact match to the provided design */
        
        /* Base Styles */
        .test-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          max-width: 100%;
          padding: 24px;
          color: #333;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
        }
        
        /* Header Styles */
        .test-header {
          margin-bottom: 2rem;
        }
        
        .test-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          color: #1a1a1a;
        }
        
        .test-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #666;
        }
        
        .progress-bar-container {
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.25rem;
        }
        
        .progress-bar {
          height: 100%;
          background-color: #1e4db7;
          border-radius: 4px;
        }
        
        .progress-text {
          font-size: 0.75rem;
          color: #666;
        }
        
        /* Section Badge */
        .section-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #f1f5fe;
          color: #1e4db7;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }
        
        /* Question Styles */
        .question-section {
          margin-bottom: 2rem;
        }
        
        .question-text {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }
        
        /* Answer Options */
        .answer-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .option-card {
          display: flex;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .option-card:hover {
          border-color: #b3c5e6;
        }
        
        .option-card.selected {
          border-color: #1e4db7;
          background-color: #f9fbff;
        }
        
        .radio-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }
        
        .custom-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #ccc;
          position: relative;
          margin-right: 0.5rem;
        }
        
        .option-card.selected .custom-radio {
          border-color: #1e4db7;
        }
        
        .option-card.selected .custom-radio:after {
          content: "";
          position: absolute;
          top: 4px;
          left: 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #1e4db7;
        }
        
        .option-card input[type="radio"] {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }
        
        .option-text {
          font-size: 1rem;
          color: #333;
        }
        
        /* Navigation Buttons */
        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        
        .previous-button, 
        .next-button, .submit-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .previous-button {
          background-color: white;
          border: 1px solid #d0d0d0;
          color: #666;
        }
        
        .previous-button:hover:not(:disabled) {
          background-color: #f5f5f5;
        }
        
        .next-button {
          background-color: #1e4db7;
          border: none;
          color: white;
        }
        .submit-button {
            background-color: #1e4db7; /* Or any color you prefer */
            border: none;
            color: white;
        }

        .submit-button:hover {
           background-color: #163a8e; /* Darker shade on hover */
        }
        
        .next-button:hover:not(:disabled) {
          background-color: #163a8e;
        }
        
        .previous-button:disabled,
        .next-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        /* Tip Container */
        .tip-container {
          background-color: #f9f9f9;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .tip-label {
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          color: #666;
        }
        
        .tip-text {
          margin: 0;
          color: #666;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        
        /* Save Button */
        .save-button {
          background: none;
          border: none;
          color: #1e4db7;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0;
          cursor: pointer;
          text-decoration: none;
        }
        
        .save-button:hover {
          text-decoration: underline;
        }
        
        /* Loading & Error States */
        .loading-container,
        .error-container {
          padding: 2rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Test;