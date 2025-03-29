import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form"; // Import useForm and Controller
import { z } from "zod"; // Import Zod
import { zodResolver } from "@hookform/resolvers/zod"; // Import Zod Resolver

import logo from "../assets/images/logo_horizontal.svg";
import "../assets/css/registration.css";

// --- Button Spinner Component ---
const ButtonSpinner = () => (
  <div className="button-spinner">
    <div className="spinner"></div>
  </div>
);
// --- End Button Spinner Component ---

// --- Zod Schema for Login Validation ---
const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .nonempty("Username or Email is required"),
  password: z
    .string()
    .nonempty("Password is required"),
});
// --- End Zod Schema ---


// --- Define Animation Config (Consistent with Registration) ---
const transitionConfig = {
    duration: 0.6,
    ease: [0.43, 0.13, 0.23, 0.96]
  };

  // Modified popup animation (fade/scale instead of vertical slide)
  const formPopupVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95 // Start slightly smaller
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        // Use same duration, maybe slightly delayed start
        duration: transitionConfig.duration,
        delay: 0.2, // Start after overlay animation is underway
        ease: transitionConfig.ease
      }
    },
    exit: { // Exit animation when going back to registration
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4, // Faster exit
        ease: "easeIn"
      }
    }
  };
  // --- End Animation Config ---

function Login() {
  // State for API-specific errors (not validation errors)
  const [apiError, setApiError] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
  });
  const navigate = useNavigate();
  // Removed isLoginActive state as it wasn't used for core logic here

  // --- React Hook Form Setup ---
  const {
    control,
    handleSubmit, // Use RHF's handleSubmit
    formState: { errors, isSubmitting }, // Get errors and isSubmitting state from RHF
    // reset, // Optionally use reset if needed
  } = useForm({
    resolver: zodResolver(loginSchema), // Use Zod resolver
    mode: "onBlur", // Validate on blur
    defaultValues: { // Set default values
      usernameOrEmail: "",
      password: "",
    },
  });
  // --- End React Hook Form Setup ---

  // RHF's handleSubmit will call this function with validated data
  const onSubmit = async (data) => {
    setApiError(""); // Clear previous API errors

    try {
      const response = await fetch("/wp-json/student-portal/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send validated data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const responseData = await response.json();
      // Handle successful login
      console.log("Login Successful:", responseData);

      localStorage.setItem("studentPortalToken", responseData.token);
      navigate("/my-background");

    } catch (error) {
      console.error("Login API Error:", error);
      setApiError( // Set API-specific error state
        error.message ||
          "Login failed. Please check your credentials and try again."
      );
    }
    // No need for finally { setIsSubmitting(false) } as RHF manages isSubmitting
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prev) => ({
      password: !prev.password,
    }));
  };

  // Simple function to decide if error icon should show (optional)
  const shouldShowErrorIcon = (fieldName) => {
      return !["password"].includes(fieldName); // Don't show icon for password field itself
  }

  return (
    <div className="login-transition-container">
      <motion.div
        className="image-overlay expanded"
        layoutId="focus-image-overlay"
        transition={transitionConfig}
      >
      </motion.div>

      <motion.div
        className="registration-page login-popup"
        variants={formPopupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex-column" style={{ alignItems: 'center' }}>
          <h1>Student Portal Login</h1>
        </div>

        {/* Display API errors (distinct from validation errors) */}
        {apiError && <div className="error-message api-error">{apiError}</div>}

        {/* Use RHF's handleSubmit to wrap the onSubmit function */}
        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
            <div className="form-column">
              {/* Username/Email */}
              <div className="form-row">
                 <div className={`form-group ${errors.usernameOrEmail ? "input-error" : ""}`}>
                   <label htmlFor="usernameOrEmail">Username</label>
                   <div className="input-wrapper">
                     {/* Use Controller for input integration */}
                     <Controller
                       name="usernameOrEmail"
                       control={control}
                       render={({ field }) => (
                         <input
                           {...field} // Spread field props (onChange, onBlur, value, ref)
                           type="text"
                           id="usernameOrEmail"
                           placeholder="e.g john.doe@email.com or johndoe"
                           disabled={isSubmitting}
                           className={errors.usernameOrEmail ? "input-error" : ""}
                         />
                       )}
                     />
                     {/* Show error icon (optional) */}
                     {errors.usernameOrEmail && shouldShowErrorIcon("usernameOrEmail") && (
                       <span className="error-icon">
                         <FeatherIcon icon="alert-circle" />
                       </span>
                     )}
                   </div>
                   {/* Display Zod validation error */}
                   {errors.usernameOrEmail && (
                     <span className="error">{errors.usernameOrEmail.message}</span>
                   )}
                 </div>
               </div>
               {/* Password */}
               <div className="form-row">
                 <div className={`form-group password-column ${errors.password ? "input-error" : ""}`}>
                   <label htmlFor="password">Password</label>
                   <div className="password-input">
                      {/* Use Controller for input integration */}
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type={passwordVisibility.password ? "text" : "password"}
                            id="password"
                            disabled={isSubmitting}
                            className={errors.password ? "input-error" : ""}
                          />
                        )}
                      />
                     <button
                       type="button"
                       className="password-toggle-btn"
                       onClick={togglePasswordVisibility}
                       aria-label={passwordVisibility.password ? "Hide password" : "Show password"}
                       disabled={isSubmitting}
                     >
                       {passwordVisibility.password ? (
                         <FeatherIcon icon="eye-off" size={20} className="password-toggle-icon" />
                       ) : (
                         <FeatherIcon icon="eye" size={20} className="password-toggle-icon" />
                       )}
                     </button>
                   </div>
                   {/* Display Zod validation error */}
                   {errors.password && (
                     <span className="error">{errors.password.message}</span>
                   )}
                 </div>
               </div>
            </div>
            {/* Login Button - uses isSubmitting from RHF */}
            <button
                type="submit"
                className="register-btn"
                disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ButtonSpinner />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
            {/* Register Link */}
            <div className="already-have-account">
               Don't have an account? <Link to="/registration">Register</Link>
            </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;