import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const simulatePayment = () => {
    // Set processing state to show loading indicator
    setIsProcessing(true);

    // Simulate a successful payment after a short delay
    setTimeout(() => {
      setPaymentSuccessful(true);
      setIsProcessing(false);
      navigate("../career-test/test-taking"); // Navigate to TestTakingPage after successful "payment"
    }, 1500); // Simulate 1.5 seconds payment processing time
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h1 className="page-title">Complete your purchase</h1>
          <span className="step-indicator">Step 1/2</span>
        </div>

        <div className="payment-content">
          <div className="payment-form-section">
            <h2 className="section-title">Payment Information</h2>
            <form className="payment-form">
              <div className="form-group">
                <label htmlFor="card-number">Card Number</label>
                <input
                  type="text"
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="expiry-date">Expiration Date</label>
                  <input
                    type="text"
                    id="expiry-date"
                    placeholder="MM/YY"
                    className="form-input"
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="security-code">Security Code</label>
                  <input
                    type="text"
                    id="security-code"
                    placeholder="123"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="card-name">Name on Card</label>
                <input
                  type="text"
                  id="card-name"
                  placeholder="e.g. John Doe"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="john.doe@email.com"
                  className="form-input"
                />
              </div>
            </form>

            <button
              type="button"
              className={`pay-button ${isProcessing ? "processing" : ""}`}
              onClick={simulatePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete Payment"}
            </button>

            <div className="secure-payment">
              <svg
                className="lock-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path d="M19 10h-1V7c0-4-3-7-7-7S4 3 4 7v3H3c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2zm-7 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM6 7c0-2.8 2.2-5 5-5s5 2.2 5 5v3H6V7z" />
              </svg>
              <span>Secure payment processing. Your data is protected.</span>
            </div>
          </div>
          <div className="order-summary">
                        <h2 className="section-title">Order Summary</h2>
                        <div className="summary-item">
                            <span className="item-name">Career Aptitude Test</span>
                            <span className="item-price">$19.99</span>
                        </div>
                        <div className="summary-item">
                            <span className="item-name">Expert Consultation</span>
                            <span className="item-price">$0.00</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-total">
                            <span className="total-label">Total</span>
                            <span className="total-amount">$19.99</span>
                        </div>
                    </div>
        </div>

        <div className="payment-footer">
          <a href="#back" className="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to test information
          </a>
        </div>
      </div>

      <style jsx>{`
        /* Modern Dashboard Style CSS */

        /* Base Styles */
        .payment-container {
        }

        .payment-card {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          max-width: 100%;
          color: #333;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.05);
        }

        /* Header Styles */
        .payment-header {
          display: flex;
          justify-content: space-between;
          align-content: center;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #eaedf3;
        }

        .step-indicator {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background-color: #f0f4ff;
          color: #3b82f6;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .page-title {
          font-size: 26px;
          font-weight: 500;
        }

        /* Content Styles */
        .payment-content {
          display: flex;
          gap: 30px;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .payment-content {
            grid-template-columns: 1fr;
          }
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1d23;
          margin-top: 0;
          margin-bottom: 1.25rem;
        }

        /* Order Summary Styles */
        .order-summary {
          background-color: #f9fafc;
          padding: 1.5rem;
          width: 320px;
          border-radius: 8px;
          height: fit-content;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: 0.9375rem;
        }

        .summary-divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 1rem 0;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 1.075rem;
          color: #1a1d23;
        }

        /* Form Styles */
        .payment-form {
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 7px;
        }

        .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .half {
          flex: 1;
        }

        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 2px;
          color: #4b5563;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.9375rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background-color: #fff;
        }

        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          outline: none;
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        /* Button Styles */
        .pay-button {
          width: 100%;
          padding: 0.875rem 1rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .pay-button:hover {
          background-color: #2563eb;
        }

        .pay-button.processing {
          background-color: #93c5fd;
          cursor: not-allowed;
        }

        /* Secure Payment Info */
        .secure-payment {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .lock-icon {
          fill: currentColor;
        }

        /* Footer Styles */
        .payment-footer {
          padding: 1.25rem 2rem;
          border-top: 1px solid #eaedf3;
          display: flex;
          justify-content: flex-start;
        }

        .payment-form-section {
          width: calc(100% - 350px);
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4b5563;
          text-decoration: none;
          font-size: 0.9375rem;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #3b82f6;
        }

        .back-link svg {
          fill: currentColor;
        }
      `}</style>
    </div>
  );
}

export default Payment;
