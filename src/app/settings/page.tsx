/** @format */

"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Pen } from "lucide-react";
import EditAccountDialog from "@/components/SettingsComponents/EditAccountDialog";
import ChangePasswordDialog from "@/components/SettingsComponents/ChangePasswordDialog";
import { Button } from "@/components/ui/button";
import { useGetFieldOwnerProfileQuery } from "@/redux/features/settings/settingsAPI";
import { toAbsoluteMediaUrl } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const getInitials = (fullName?: string) => {
  if (!fullName) return "U";

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const SettingsPage = () => {
  const { t } = useTranslation("dashboard");
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data, isLoading, isFetching, isError } =
    useGetFieldOwnerProfileQuery();
  const profile = data?.data;
  const profileImageUrl = toAbsoluteMediaUrl(profile?.profile_image);
  const initials = getInitials(profile?.full_name);

  return (
    <div className="w-full p-3 md:p-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            {t("settingsPage.title")}
          </h1>
          <p className="text-sm text-secondary mt-1">
            {t("settingsPage.subtitle")}
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl border border-white/5 bg-card p-5 sm:p-6 space-y-8">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-custom-red/30 to-custom-yellow/30 flex items-center justify-center shrink-0">
              {profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-xl sm:text-2xl font-bold text-primary">
                  {initials}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-primary">
                {profile?.full_name || "-"}
              </h2>
              <p className="text-sm text-secondary">
                {t("settingsPage.arenaOwner")}
              </p>
            </div>
          </div>

          {isLoading || isFetching ? (
            <div className="text-sm text-secondary">
              {t("settingsPage.loading")}
            </div>
          ) : null}

          {isError ? (
            <div className="text-sm text-destructive">
              {t("settingsPage.loadFailed")}
            </div>
          ) : null}

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-5">
              {t("settingsPage.personalInfo")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm text-secondary">
                  {t("settingsPage.fullName")}
                </label>
                <input
                  type="text"
                  readOnly
                  value={profile?.full_name || ""}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-white/10 text-sm text-primary cursor-default focus:outline-none"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-sm text-secondary">
                  {t("settingsPage.email")}
                </label>
                <input
                  type="email"
                  readOnly
                  value={profile?.email_address || ""}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-white/10 text-sm text-primary cursor-default focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm text-secondary">
                  {t("settingsPage.password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    readOnly
                    value={profile?.password || "********"}
                    className="w-full px-4 py-2.5 pr-10 rounded-lg bg-muted border border-white/10 text-sm text-primary cursor-default focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label className="text-sm text-secondary">
                  {t("settingsPage.contactNumber")}
                </label>
                <input
                  type="number"
                  readOnly
                  value={profile?.contact_number || ""}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-white/10 text-sm text-primary cursor-default focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setPasswordOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border bg-transparent border-white/10 text-sm text-primary font-medium hover:bg-white/5 transition-colors"
            >
              {t("settingsPage.passwordChange")}
            </Button>
            <Button
              onClick={() => setEditOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg "
            >
              <Pen className="w-4 h-4" />
              {t("settingsPage.editProfile")}
            </Button>
          </div>
        </div>

        {/* Dialogs */}
        <EditAccountDialog
          key={`${profile?.id ?? "profile"}-${editOpen ? "open" : "closed"}`}
          open={editOpen}
          onOpenChange={setEditOpen}
          profile={profile ?? null}
        />
        <ChangePasswordDialog
          open={passwordOpen}
          onOpenChange={setPasswordOpen}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
