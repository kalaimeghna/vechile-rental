import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import axiosInstance from "../api/axios";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

// =========================================================
// COMPONENT
// =========================================================

const ForgotPassword: React.FC = () => {
  // =======================================================
  // STATE
  // =======================================================

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  // =======================================================
  // VALIDATE EMAIL
  // =======================================================

  const validateEmail = (): boolean => {
    setError("");
    setEmailError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email address is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateEmail()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setEmailError("");

      /*
       * Expected backend endpoint:
       *
       * POST /api/auth/forgot-password
       *
       * Body:
       * {
       *   email: "user@example.com"
       * }
       */

      await axiosInstance.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSuccess(true);
    } catch (err: unknown) {
      console.error("Forgot password error:", err);

      const errorResponse = err as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
      };

      const message =
        errorResponse?.response?.data?.message ||
        errorResponse?.response?.data?.error ||
        "Unable to send the reset link. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // SUCCESS SCREEN
  // =======================================================

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>

            {/* Title */}
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Check Your Email
            </h1>

            {/* Message */}
            <p className="mt-3 text-sm text-gray-500 leading-6">
              If an account exists with
              <span className="font-medium text-gray-700"> {email}</span>, we've
              sent a password reset link to that email address.
            </p>

            {/* Instructions */}
            <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100 text-left">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Didn't receive the email?
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-blue-700">
                    <li>• Check your spam or junk folder.</li>
                    <li>• Make sure your email address is correct.</li>
                    <li>• Request another reset link if necessary.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Back to login */}
            <div className="mt-6">
              <Link
                to="/login"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  w-full
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-blue-700
                  transition
                "
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>

            {/* Try another email */}
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setError("");
                setEmailError("");
              }}
              className="
                mt-4
                text-sm
                font-medium
                text-blue-600
                hover:text-blue-700
              "
            >
              Try another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =======================================================
  // MAIN UI
  // =======================================================

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* =================================================
            HEADER
        ================================================== */}
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-sm">
            <Mail className="w-7 h-7 text-white" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm text-gray-500 leading-6">
            No worries. Enter your registered email and we'll send you a link to
            reset your password.
          </p>
        </div>

        {/* =================================================
            FORM CARD
        ================================================== */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 leading-5">{error}</p>
            </div>
          )}

          {/* =================================================
              FORM
          ================================================== */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              placeholder="Enter your registered email"
              autoComplete="email"
              leftIcon={<Mail className="w-5 h-5" />}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value);
                setEmailError("");
                setError("");
              }}
              error={emailError}
              required
            />

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              loadingText="Sending Reset Link..."
              leftIcon={!loading ? <Mail className="w-5 h-5" /> : undefined}
            >
              Send Reset Link
            </Button>
          </form>

          {/* =================================================
              BACK TO LOGIN
          ================================================== */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/login"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-blue-600
                hover:text-blue-700
                transition
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* =================================================
            SECURITY MESSAGE
        ================================================== */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Your account security is our priority.</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
