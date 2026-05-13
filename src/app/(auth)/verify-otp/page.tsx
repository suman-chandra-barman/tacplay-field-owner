/** @format */

"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useResendForgotPasswordOtpMutation,
  useResendSignupOtpMutation,
  useVerifyForgotPasswordOtpMutation,
  useVerifySignupOtpMutation,
} from "@/redux/features/auth/authAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearPendingVerification,
  setAuthSession,
} from "@/redux/features/auth/authSlice";
import {
  getErrorMessage,
  getSuccessMessage,
  saveAuthTokens,
  saveAuthUser,
} from "@/lib/auth";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pendingEmail = useAppSelector((state) => state.auth.pendingEmail);
  const pendingPurpose = useAppSelector(
    (state) => state.auth.verificationPurpose,
  );

  const queryParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const purposeFromQuery = queryParams?.get("purpose");
  const purpose =
    purposeFromQuery === "forgot-password" || purposeFromQuery === "signup"
      ? purposeFromQuery
      : pendingPurpose || "signup";

  const emailFromQuery = queryParams?.get("email") || "";
  const emailAddress = useMemo(
    () => emailFromQuery || pendingEmail,
    [emailFromQuery, pendingEmail],
  );

  const [verifySignupOtp, { isLoading: isVerifyingSignupOtp }] =
    useVerifySignupOtpMutation();
  const [verifyForgotPasswordOtp, { isLoading: isVerifyingForgotOtp }] =
    useVerifyForgotPasswordOtpMutation();
  const [resendSignupOtp, { isLoading: isResendingSignupOtp }] =
    useResendSignupOtpMutation();
  const [resendForgotPasswordOtp, { isLoading: isResendingForgotOtp }] =
    useResendForgotPasswordOtpMutation();

  const isVerifying = isVerifyingSignupOtp || isVerifyingForgotOtp;
  const isResending = isResendingSignupOtp || isResendingForgotOtp;

  const otpCode = otp.join("");

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async () => {
    if (!emailAddress) {
      toast.error("Email is missing. Please start the process again.");
      return;
    }

    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      if (purpose === "forgot-password") {
        const response = await verifyForgotPasswordOtp({
          email_address: emailAddress,
          otp_code: otpCode,
        }).unwrap();

        if (!response.accessToken || !response.refreshToken || !response.user) {
          toast.error("Verification response is missing required auth data");
          return;
        }

        saveAuthTokens(response.accessToken, response.refreshToken);
        saveAuthUser(response.user);
        dispatch(setAuthSession(response.user));
        dispatch(clearPendingVerification());
        toast.success(getSuccessMessage(response, "OTP verified"));
        router.push("/reset-pass");
        return;
      }

      const response = await verifySignupOtp({
        email_address: emailAddress,
        otp_code: otpCode,
      }).unwrap();

      dispatch(clearPendingVerification());
      toast.success(getSuccessMessage(response, "Email verified successfully"));
      router.push("/sign-in");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to verify OTP"));
    }
  };

  const handleResendOtp = async () => {
    if (!emailAddress) {
      toast.error("Email is missing. Please start the process again.");
      return;
    }

    try {
      const response =
        purpose === "forgot-password"
          ? await resendForgotPasswordOtp({
              email_address: emailAddress,
            }).unwrap()
          : await resendSignupOtp({
              email_address: emailAddress,
            }).unwrap();

      toast.success(getSuccessMessage(response, "OTP resent successfully"));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to resend OTP"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-root-bg relative overflow-hidden px-4">
      {/* Red gradient glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-custom-red/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-card/80 backdrop-blur-sm p-6 sm:p-8 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/Tacplay-logo-2.png"
            alt="TacPlay"
            width={80}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">
            Verify your Code
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We sent a verification code to{" "}
            <span className="text-custom-yellow font-medium">
              {emailAddress || "example@email.com"}
            </span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div
          className="flex justify-center gap-2 sm:gap-3"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold rounded-lg bg-input/30 border border-white/10 text-primary focus:outline-none focus:ring-1 focus:ring-custom-yellow/50 focus:border-custom-yellow/50 transition-colors"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleVerifyOtp}
          disabled={isVerifying}
          className="w-full py-3 rounded-lg bg-custom-red text-white text-sm font-semibold hover:bg-custom-red/90 transition-colors border-2 border-border mt-2"
        >
          {isVerifying ? "Verifying..." : "Send Code"}
        </button>

        {/* Resend */}
        <p className="text-sm text-center text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-custom-yellow font-semibold hover:underline transition-colors"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
