import React from 'react';

function PaymentSuccessPage() {
    return (
        <div className="payment-success-page-container">
            <div className="payment-success-page">
                <h2 className="step-indicator">Step 2/2</h2>
                <div className="success-header">
                    <div className="success-icon-container">
                        <img src={SuccessIcon} alt="Payment Successful" className="success-icon" />
                    </div>
                    <div className="success-text">
                        <h1 className="page-title">Payment Successful</h1>
                        <p className="thank-you-message">Thank you for your purchase!</p>
                        <p className="order-confirmation">Order #12345678</p> {/* Replace with dynamic order number later */}
                        <p className="view-receipt"><a href="#receipt">View Receipt</a></p> {/* Placeholder link */}
                    </div>
                </div>

                <div className="begin-test-section">
                    <h2 className="section-title">Begin Your Career Aptitude Test</h2>
                    <p className="section-description">
                        You're about to take a comprehensive assessment that will help identify your strengths, interests, and the career paths best suited for you.
                        The test takes approximately 15-20 minutes to complete.
                    </p>
                    <ul className="test-instructions">
                        <li>Answer honestly - there are no right or wrong answers.</li>
                        <li>The test consists of 60 questions across 5 categories.</li> {/* Corrected categories to 5 based on image */}
                        <li>You can pause and resume the test if needed, but it's best to complete it in one session.</li>
                        <li>Your results will be available immediately upon completion, and a consultation session will be scheduled within 48 hours.</li>
                    </ul>
                    <button className="start-test-button">Start The Test Now</button>
                    <p className="save-for-later">
                        Don't have time right now? Don't worry, we've sent a link to your email so you can start the test when you're ready.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccessPage;