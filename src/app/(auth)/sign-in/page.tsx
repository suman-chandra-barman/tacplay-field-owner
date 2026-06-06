/** @format */

"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthBanner from "@/components/AuthComponents/AuthBanner";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useLoginFieldOwnerMutation } from "@/redux/features/auth/authAPI";
import { useAppDispatch } from "@/redux/hooks";
import { setAuthSession } from "@/redux/features/auth/authSlice";
import { getErrorMessage, saveAuthTokens, saveAuthUser } from "@/lib/auth";
import { useTranslation } from "react-i18next";


function safeReturnPath(from: string | null): string | null {
  if (!from) return null;
  if (!from.startsWith("/") || from.startsWith("//")) return null;
  if (from.startsWith("/api")) return null;
  return from;
}

const SignInPageInner = () => {
  const { t } = useTranslation("dashboard");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [loginFieldOwner, { isLoading }] = useLoginFieldOwnerMutation();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      const response = await loginFieldOwner({
        business_email: trimmed,
        password,
      }).unwrap();

      const tokens = response.data?.tokens;
      const user = response.data?.user;
      if (!tokens?.access || !tokens?.refresh || !user) {
        toast.error("Login response is missing required auth data.");
        return;
      }

      saveAuthTokens(tokens.access, tokens.refresh);
      saveAuthUser(user);
      dispatch(setAuthSession(user));

      const defaultDestination = user.arena_info_saved ? "/" : "/profile-setup";

      const returnTo = searchParams
        ? (safeReturnPath(searchParams.get("from")) ??
          safeReturnPath(searchParams.get("redirect")) ??
          defaultDestination)
        : defaultDestination;

      router.push(returnTo);
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "Sign in failed."));
    }
  };

  return (
    <AuthBanner>
      <div className="flex flex-col items-center">
        <div className="h-12 mb-4">
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
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 text-center">
          {t("auth.welcomeBack")}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm">
          {t("auth.signInDesc")}
        </p>

        {/* Form */}
        <form className="w-full space-y-5" onSubmit={handleSignIn} noValidate>
          {/* Business Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("auth.businessEmail")}
            </label>
            <input
              type="email"
              name="business_email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.placeholders.enterEmail")}
              className="w-full px-4 py-2.5 rounded-lg bg-input/30 border border-white/10 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-custom-yellow/50 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-primary">
                {t("auth.password")}
              </label>
              <Link
                href="/forgot-pass"
                className="text-xs text-primary hover:text-custom-yellow transition-colors font-medium"
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.placeholders.enterPassword")}
                className="w-full px-4 py-2.5 pr-11 rounded-lg bg-input/30 border border-white/10 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-custom-yellow/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer py-3 rounded-lg bg-custom-red text-white text-sm font-semibold hover:bg-custom-red/90 transition-colors border-2 border-border disabled:opacity-60 disabled:pointer-events-none"
          >
            {isLoading ? t("auth.signingIn") : t("auth.signIn")}
          </button>

          {/* Don't have account */}
          <p className="text-sm text-center text-muted-foreground">
            {t("auth.dontHaveAccount")}{" "}
            <Link
              href="/sign-up"
              className="text-primary cursor-pointer font-semibold underline underline-offset-2 hover:text-custom-yellow transition-colors"
            >
              {t("auth.signUp")}
            </Link>
          </p>
        </form>
      </div>
    </AuthBanner>
  );
};

export default function SignInPage() {
  const { t } = useTranslation("dashboard");
  return (
    <Suspense
      fallback={
        <AuthBanner>
          <div className="flex min-h-60 items-center justify-center text-sm text-muted-foreground">
            {t("auth.loading")}
          </div>
        </AuthBanner>
      }
    >
      <SignInPageInner />
    </Suspense>
  );
}
