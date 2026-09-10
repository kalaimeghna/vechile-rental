import React, { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import axiosInstance from "../../api/axios";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

// =========================================================
// PASSWORD RULES
// =========================================================

interface PasswordRules {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

// =========================================================
// COMPONENT
// =========================================================

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Supports both:
  // /reset-password?token=xxxxx
  // /reset-password/:token
  const token = searchParams.get("token") || "";

  // =======================================================
  // STATE
  // =======================================================

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  const [fieldError, setFieldError] = useState("");

  // =======================================================
  // PASSWORD RULES
  // =======================================================

  const passwordRules = useMemo<PasswordRules>(
    () => ({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const isStrongPassword = Object.values(passwordRules).every(Boolean);

  // =======================================================
  // VALIDATE
  // =======================================================

  const validateForm = (): boolean => {
    setError("");
    setFieldError("");

    if (!token) {
      setError("Invalid or missing password reset token.");

      return false;
    }

    if (!password) {
      setFieldError("Please enter a new password.");

      return false;
    }

    if (!isStrongPassword) {
      setFieldError(
        "Please create a stronger password that meets all requirements.",
      );

      return false;
    }

    if (!confirmPassword) {
      setFieldError("Please confirm your new password.");

      return false;
    }

    if (password !== confirmPassword) {
      setFieldError("Passwords do not match.");

      return false;
    }

    return true;
  };

  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFieldError("");

      /*
       * Expected backend:
       *
       * PUT /api/auth/reset-password
       *
       * {
       *   token,
       *   password
       * }
       */

      await axiosInstance.put("/auth/reset-password", {
        token,
        password,
      });

      setSuccess(true);

      setPassword("");
      setConfirmPassword("");

      // Redirect after showing success message
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: any) {
      console.error("Reset password error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to reset your password. The link may have expired.";

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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Password Reset Successful
            </h1>

            <p className="mt-3 text-sm text-gray-500 leading-6">
              Your password has been updated successfully.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Redirecting you to the login page...
            </p>

            <div className="mt-6">
              <Button fullWidth onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =======================================================
  // INVALID TOKEN SCREEN
  // =======================================================

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-9 h-9 text-red-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Invalid Reset Link
            </h1>

            <p className="mt-3 text-sm text-gray-500 leading-6">
              This password reset link is invalid or incomplete.
            </p>

            <div className="mt-6">
              <Button fullWidth onClick={() => navigate("/forgot-password")}>
                Request New Reset Link
              </Button>
            </div>
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
            LOGO / BRAND
        ================================================== */}

        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-sm">
            <LockKeyhole className="w-7 h-7 text-white" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Reset Your Password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a new password for your account.
          </p>
        </div>

        {/* =================================================
            CARD
        ================================================== */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {/* Error */}

          {(error || fieldError) && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />

              <p className="text-sm text-red-700 leading-5">
                {error || fieldError}
              </p>
            </div>
          )}

          {/* =================================================
              FORM
          ================================================== */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}

            <div>
              <Input
                label="New Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter new password"
                onChange={(event) => {
                  setPassword(event.target.value);

                  setError("");
                  setFieldError("");
                }}
                leftIcon={<LockKeyhole className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="text-gray-500 hover:text-gray-700 transition"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                error={fieldError && !isStrongPassword ? fieldError : undefined}
                required
              />

              {/* Password Rules */}

              <div className="mt-3 rounded-xl bg-gray-50 p-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Password must contain:
                </p>

                <div className="space-y-1.5">
                  <PasswordRule
                    valid={passwordRules.minLength}
                    text="At least 8 characters"
                  />

                  <PasswordRule
                    valid={passwordRules.uppercase}
                    text="At least one uppercase letter"
                  />

                  <PasswordRule
                    valid={passwordRules.lowercase}
                    text="At least one lowercase letter"
                  />

                  <PasswordRule
                    valid={passwordRules.number}
                    text="At least one number"
                  />

                  <PasswordRule
                    valid={passwordRules.special}
                    text="At least one special character"
                  />
                </div>
              </div>
            </div>

            {/* Confirm Password */}

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="Confirm your password"
              onChange={(event) => {
                setConfirmPassword(event.target.value);

                setError("");
                setFieldError("");
              }}
              leftIcon={<ShieldCheck className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  className="text-gray-500 hover:text-gray-700 transition"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
              error={
                confirmPassword && password !== confirmPassword
                  ? "Passwords do not match."
                  : undefined
              }
              required
            />

            {/* Password Match */}

            {confirmPassword && (
              <div
                className={`
                  flex
                  items-center
                  gap-2
                  text-xs
                  ${
                    password === confirmPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }
                `}
              >
                {password === confirmPassword ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />

                    <span>Passwords match</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />

                    <span>Passwords do not match</span>
                  </>
                )}
              </div>
            )}

            {/* Submit */}

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              loadingText="Updating Password..."
              disabled={!isStrongPassword || password !== confirmPassword}
            >
              Reset Password
            </Button>
          </form>

          {/* =================================================
              LOGIN LINK
          ================================================== */}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        {/* =================================================
            SECURITY NOTE
        ================================================== */}

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4" />

          <span>Your password is securely protected.</span>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// PASSWORD RULE COMPONENT
// =========================================================

interface PasswordRuleProps {
  valid: boolean;
  text: string;
}

const PasswordRule: React.FC<PasswordRuleProps> = ({ valid, text }) => {
  return (
    <div
      className={`
        flex
        items-center
        gap-2
        text-xs
        ${valid ? "text-green-600" : "text-gray-500"}
      `}
    >
      {valid ? (
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <span
          className="
            w-3.5
            h-3.5
            rounded-full
            border
            border-gray-300
            shrink-0
          "
        />
      )}

      <span>{text}</span>
    </div>
  );
};

export default ResetPassword;
