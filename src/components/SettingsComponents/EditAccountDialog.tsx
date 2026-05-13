/** @format */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useUpdateFieldOwnerProfileMutation } from "@/redux/features/settings/settingsAPI";
import type { FieldOwnerProfile } from "@/types/SettingTypes";
import { toAbsoluteMediaUrl } from "@/lib/utils";
import { toast } from "react-toastify";
import { getErrorMessage, getSuccessMessage, saveAuthUser } from "@/lib/auth";
import { useTranslation } from "react-i18next";

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: FieldOwnerProfile | null;
}

const EditAccountDialog: React.FC<EditAccountDialogProps> = ({
  open,
  onOpenChange,
  profile,
}) => {
  const { t } = useTranslation("dashboard");
  const [fullName, setFullName] = useState(() => profile?.full_name || "");
  const [contactNumber, setContactNumber] = useState(
    () => profile?.contact_number || "",
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateFieldOwnerProfileMutation();

  const previewImageUrl = useMemo(() => {
    if (!selectedImage) return null;
    return URL.createObjectURL(selectedImage);
  }, [selectedImage]);

  useEffect(
    () => () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    },
    [previewImageUrl],
  );

  const currentImageUrl = toAbsoluteMediaUrl(profile?.profile_image);
  const displayImage = previewImageUrl || currentImageUrl;

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error(t("editAccount.fullNameRequired"));
      return;
    }

    if (!contactNumber.trim()) {
      toast.error(t("editAccount.contactRequired"));
      return;
    }

    const payload = new FormData();
    payload.append("full_name", fullName.trim());
    payload.append("contact_number", contactNumber.trim());
    if (selectedImage) {
      payload.append("profile_image", selectedImage);
    }

    try {
      const response = await updateProfile(payload).unwrap();
      if (response?.data) {
        saveAuthUser(response.data);
      }
      toast.success(getSuccessMessage(response, t("editAccount.updated")));
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, t("editAccount.updateFailed")));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-card border border-white/10 max-w-sm"
      >
        <DialogHeader className="items-center">
          <DialogTitle className="text-xl font-bold text-primary">
            {t("editAccount.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-secondary">
            {t("editAccount.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 mt-2">
          {/* Avatar Upload */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
              {displayImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayImage}
                  alt={t("navbar.profileAlt")}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-custom-red/30 to-custom-yellow/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {(fullName || profile?.full_name || "U")
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase() ?? "")
                      .join("") || "U"}
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-custom-red text-white flex items-center justify-center shadow-lg hover:bg-custom-red/80 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                setSelectedImage(event.target.files?.[0] ?? null)
              }
            />
          </div>

          {/* Full Name */}
          <div className="w-full space-y-2">
            <label className="text-sm text-secondary">
              {t("editAccount.fullName")}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-white/10 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-custom-yellow/50"
            />
          </div>

          <div className="w-full space-y-2">
            <label className="text-sm text-secondary">
              {t("editAccount.contactNumber")}
            </label>
            <input
              type="number"
              value={contactNumber}
              onChange={(event) => setContactNumber(event.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-white/10 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-custom-yellow/50"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="w-full py-2.5 rounded-lg bg-custom-red text-white text-sm font-medium hover:bg-custom-red/80 transition-colors"
          >
            {isUpdating
              ? t("editAccount.saving")
              : t("editAccount.saveChanges")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountDialog;
