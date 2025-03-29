import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; 

// Importing assets (ensure these paths are correct)
import countries from "../assets/data/countries.json";
import logo from "../assets/images/logo_horizontal.svg";
import "../assets/css/registration.css";

// Zod Schema for Validation
const registrationSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required") // Explicitly set a required message
    .min(2, "Name must be at least 2 characters"),

  surname: z
    .string()
    .nonempty("Surname is required")
    .min(2, "Surname must be at least 2 characters"),
  dateOfBirth: z.string().optional(),
  genderId: z
    .string()
    .nonempty("Gender is required"),
  nationality: z.string().optional(),
  passportNumber: z.string().optional(),
  username: z
    .string()
    .nonempty("Username is required")
    .min(5, "Username must be at least 5 characters"),

  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email format"),

  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),

  verifyPassword: z.string(),

  agreeToTerms: z
    .boolean()
    .refine((val) => val, {
      message: "You must agree to the Terms and Conditions and Privacy Policy",
    }),
}).refine((data) => data.password === data.verifyPassword, {
  message: "Passwords do not match",
  path: ["verifyPassword"],
});

// Password Strength Component
const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    const result = zxcvbn(password);
    const strengthLabels = [
      "Very Weak",
      "Weak",
      "Medium",
      "Strong",
    ];
    const strengthColors = [
      "#FF4136",
      "#FF851B",
      "#FFDC00",
      "#2ECC40",
      "#3D9970",
    ];

    return {
      score: result.score,
      label: strengthLabels[result.score],
      color: strengthColors[result.score],
    };
  };

  const strength = password ? getPasswordStrength(password) : null;

  return password ? (
    <div className="password-strength">
      <div
        className="strength-bar"
        style={{
          width: `${(strength.score + 1) * 20}%`,
          backgroundColor: strength.color,
          height: "5px",
          transition: "width 0.3s ease-in-out",
          borderRadius: "2.5px",
          marginTop: "5px",
        }}
      />
      <span
        style={{
          color: strength.color,
          fontSize: "14px",
        }}
      >
        {strength.label}
      </span>
    </div>
  ) : null;
};

const ButtonSpinner = () => (
  <div className="button-spinner">
    <div className="spinner"></div>
  </div>
);


// --- Define Animation Config ---
const transitionConfig = {
  duration: 0.6, // Slightly longer duration for smoother feel
  ease: [0.43, 0.13, 0.23, 0.96] // Example ease function
};

const formSlideFade = {
  initial: { x: '50%', opacity: 0 }, // Start from right, faded
  animate: { x: 0, opacity: 1, transition: transitionConfig }, // Slide in, fade in
  exit: { x: '50%', opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } } // Slide out right, fade out (slightly faster exit)
};
// --- End Animation Config ---

// Main Registration Component
function Registration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    verifyPassword: false,
  });
  const [isLoginActive, setIsLoginActive] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur",
  });

  const passwordValue = watch("password");

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Remove verifyPassword before sending to backend
      const { verifyPassword, ...submitData } = data;

      const response = await fetch("/wp-json/student-portal/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      await response.json();
      setSubmitSuccess(true);
      reset(); // Reset form after successful submission
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab) => {
    setIsLoginActive(tab === "login");
  };

  const shouldShowErrorIcon = (fieldName) => {
    return !["password","verifyPassword", "genderId", "nationality", "agreeToTerms"].includes(fieldName);
  };

  return (
    <motion.div className="registration-container">
      <img className="logo-image" src={logo} alt="Scholarships Logo" />
      <div className="focus-area">
        <motion.div
          className="image-overlay"
          layoutId="focus-image-overlay" 
          // Apply consistent transition to layout animation
          transition={transitionConfig} 
        >
        </motion.div>
      </div>
      
      <motion.div
        className={`registration-page`} // Remove login-active class logic if not needed here
        // Apply variants for enter/exit
        variants={formSlideFade}
        initial="initial"
        animate="animate"
        exit="exit" 
      >
          <div className="flex-row">
            <div className="flex-column">
              <h1>Student Portal Registration</h1>
            </div>
          </div>

          {submitError && (
            <div className="error-message api-error">{submitError}</div>
          )}

          {submitSuccess && (
            <div className="success-message">
              Registration successful! You can now log in.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
            {/* Personal Information Section */}
            <div className="form-column">
              <h2 className="section-divider">Personal Information</h2>
              <div className={`form-row`}>
                <div
                  className={`form-group ${errors.name ? "input-error" : ""}`}
                >
                  <label>Name</label>
                  <div className="input-wrapper"> {/* Add wrapper div */}
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="e.g John Doe"
                          className={errors.name ? "input-error" : ""}
                        />
                      )}
                    />
                    {errors.name && shouldShowErrorIcon("name") && (
                      <span className="error-icon">
                        <FeatherIcon icon="alert-circle" />
                      </span>
                    )}
                  </div>
                  {errors.name && (
                    <span className="error">{errors.name.message}</span>
                  )}
                </div>
                <div
                  className={`form-group ${errors.surname ? "input-error" : ""}`}
                >
                  <label>Surname</label>
                  <div className="input-wrapper"> {/* Add wrapper div */}
                    <Controller
                      name="surname"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Surname"
                          className={errors.surname ? "input-error" : ""}
                        />
                      )}
                    />
                    {errors.surname && shouldShowErrorIcon("surname") && (
                      <span className="error-icon">
                        <FeatherIcon icon="alert-circle" />
                      </span>
                    )}
                  </div>
                  {errors.surname && (
                    <span className="error">{errors.surname.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => <input {...field} type="date" />}
                  />
                </div>
              </div>

              <div className="form-row">
                <div
                  className={`form-group ${errors.genderId ? "input-error" : ""}`}
                >
                  <label>Gender</label>
                  <div className="input-wrapper"> {/* Add wrapper div */}
                    <Controller
                      name="genderId"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={errors.genderId ? "input-error" : ""}
                        >
                          <option value="">Select</option>
                          <option value="1">Male</option>
                          <option value="2">Female</option>
                          <option value="3">Other</option>
                        </select>
                      )}
                    />
                    {errors.genderId && shouldShowErrorIcon("genderId") && (
                      <span className="error-icon">
                        <FeatherIcon icon="alert-circle" />
                      </span>
                    )}
                  </div>
                  {errors.genderId && (
                    <span className="error">{errors.genderId.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Nationality</label>
                  <Controller
                    name="nationality"
                    control={control}
                    render={({ field }) => (
                      <select {...field}>
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                <div className="form-group">
                  <label>Passport Number</label>
                  <Controller
                    name="passportNumber"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g A4546878"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="form-column">
              <h2 className="section-divider">Account Information</h2>
              <div className="form-row">
                <div
                  className={`form-group ${errors.username ? "input-error" : ""}`}
                >
                  <label>Username</label>
                  <div className="input-wrapper"> {/* Add wrapper div */}
                    <Controller
                      name="username"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="e.g john.doe"
                          className={errors.username ? "input-error" : ""}
                        />
                      )}
                    />
                    {errors.username && shouldShowErrorIcon("username") && (
                      <span className="error-icon">
                        <FeatherIcon icon="alert-circle" />
                      </span>
                    )}
                  </div>
                  {errors.username && (
                    <span className="error">{errors.username.message}</span>
                  )}
                </div>
                <div
                  className={`form-group ${errors.email ? "input-error" : ""}`}
                >
                  <label>Email</label>
                   <div className="input-wrapper"> {/* Add wrapper div */}
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          placeholder="john.doe@gmail.com"
                          className={errors.email ? "input-error" : ""}
                        />
                      )}
                    />
                    {errors.email && shouldShowErrorIcon("email") && (
                      <span className="error-icon">
                        <FeatherIcon icon="alert-circle" />
                      </span>
                    )}
                  </div>
                   {errors.email && (
                    <span className="error">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div
                  className={`form-group password-column ${
                    errors.password ? "input-error" : ""
                  }`}
                >
                  <label>Password</label>
                  <div className="password-input">
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type={
                            passwordVisibility.password ? "text" : "password"
                          }
                          className={errors.password ? "input-error" : ""}
                        />
                      )}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => togglePasswordVisibility("password")}
                      aria-label={
                        passwordVisibility.password
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {passwordVisibility.password ? (
                        <FeatherIcon
                          icon="eye-off"
                          size={20}
                          className="password-toggle-icon"
                        />
                      ) : (
                        <FeatherIcon
                          icon="eye"
                          size={20}
                          className="password-toggle-icon"
                        />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error">{errors.password.message}</span>
                  )}
                  <PasswordStrengthIndicator password={passwordValue} />
                </div>
                <div
                  className={`form-group password-column ${
                    errors.verifyPassword ? "input-error" : ""
                  }`}
                >
                  <label>Verify Password</label>
                  <div className="password-input">
                    <Controller
                      name="verifyPassword"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type={
                            passwordVisibility.verifyPassword
                              ? "text"
                              : "password"
                          }
                          className={errors.verifyPassword ? "input-error" : ""}
                        />
                      )}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => togglePasswordVisibility("verifyPassword")}
                      aria-label={
                        passwordVisibility.verifyPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {passwordVisibility.verifyPassword ? (
                        <FeatherIcon
                          icon="eye-off"
                          size={20}
                          className="password-toggle-icon"
                        />
                      ) : (
                        <FeatherIcon
                          icon="eye"
                          size={20}
                          className="password-toggle-icon"
                        />
                      )}
                    </button>
                  </div>
                  {errors.verifyPassword && (
                   <span className="error">{errors.verifyPassword.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Combined Terms and Conditions & Privacy Policy Checkbox */}
            <div className="form-section checkboxes-section">
              <div
                className={`form-row checkbox-row ${
                  errors.agreeToTerms ? "input-error" : ""
                }`}
              >
                <Controller
                  name="agreeToTerms"
                  control={control}
                  render={({ field: { value, ...field } }) => (
                    <input
                      {...field}
                      type="checkbox"
                      checked={value}
                      id="agreeToTerms"
                    />
                  )}
                />
                <label htmlFor="agreeToTerms">
                  I agree to the <a href="#">Terms and Conditions</a> and have
                  read and understand the <a href="#">Privacy Policy</a>.
                </label>
                {errors.agreeToTerms && (
                    <p className="error">{errors.agreeToTerms.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="register-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ButtonSpinner />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
            <div className="already-have-account">
                Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </form>
          </motion.div>
    </motion.div>
  );
}

export default Registration;