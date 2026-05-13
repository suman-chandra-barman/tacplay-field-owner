/** @format */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "@/redux/features/auth/authAPI";
import { useAppDispatch } from "@/redux/hooks";
import { setPendingVerification } from "@/redux/features/auth/authSlice";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";

const ForgotPasswordPage = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSendCode = async () => {
    if (!emailAddress) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const response = await forgotPassword({
        email_address: emailAddress,
      }).unwrap();

      dispatch(
        setPendingVerification({
          email: response.data.email_address,
          purpose: "forgot-password",
        }),
      );

      toast.success(getSuccessMessage(response, "OTP sent successfully"));
      router.push(
        `/verify-otp?purpose=forgot-password&email=${encodeURIComponent(response.data.email_address)}`,
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to send OTP"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-root-bg relative overflow-hidden px-4">
      {/* Red gradient glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-custom-red/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-card/80 backdrop-blur-sm p-6 sm:p-8 space-y-6">
        <div className="h-6 flex items-center justify-center">
          {/* Logo */}
          <Image
            src="/Tacplay-logo-2.png"
            alt="TacPlay"
            width={200}
            height={200}
            className="object-contain h-12 "
            priority
          />
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">
            Forgot your password?
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a verification code to
            reset it.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-input/30 border border-white/10 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-custom-yellow/50 transition-colors"
            />
          </div>

          <button
            onClick={handleSendCode}
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-custom-red text-white text-sm font-semibold hover:bg-custom-red/90 transition-colors border-2 border-border mt-2"
          >
            {isLoading ? "Sending..." : "Send Code"}
          </button>
        </div>

        {/* Back to sign in */}
        <p className="text-sm text-center text-muted-foreground">
          Back to{" "}
          <Link
            href="/sign-in"
            className="text-primary font-semibold underline underline-offset-2 hover:text-custom-yellow transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
