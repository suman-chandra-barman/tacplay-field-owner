/** @format */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Trash2, Plus, Loader2, Upload, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";
import { useEditArenaInfoMutation } from "@/redux/features/arenaManagement/arenaManagementAPI";
import { useTranslation } from "react-i18next";
import { toAbsoluteMediaUrl } from "@/lib/utils";

interface ManageCoverImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  arenaInfo: any;
}

export default function ManageCoverImagesModal({
  isOpen,
  onClose,
  arenaInfo,
}: ManageCoverImagesModalProps) {
  const { t } = useTranslation("dashboard");
  const [editArenaInfo, { isLoading: isSaving }] = useEditArenaInfoMutation();

  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  // Reset local state when modal is closed or opened
  useEffect(() => {
    if (isOpen) {
      setDeletedIds([]);
      setNewFiles([]);
      setNewPreviews([]);
    }
  }, [isOpen]);

  const existingMedia = arenaInfo?.media || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map((file) => URL.createObjectURL(file));
      
      setNewFiles((prev) => [...prev, ...filesArray]);
      setNewPreviews((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteExisting = (id: number) => {
    setDeletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!arenaInfo) return;

    try {
      // Create comma-separated string for deleted image IDs
      const deleteIdsString = deletedIds.join(",");

      const payload = {
        field_name: arenaInfo.field_name || "",
        description: arenaInfo.description || "",
        country: arenaInfo.country?.name || "",
        city: arenaInfo.city?.name || "",
        full_address: arenaInfo.full_address || "",
        images: newFiles,
        delete_image_ids: deleteIdsString || undefined,
      };

      const response = await editArenaInfo(payload).unwrap();

      toast.success(
        getSuccessMessage(response, t("arena.coverImagesUpdated", "Cover images updated successfully."))
      );
      onClose();
    } catch (error) {
      toast.error(
        getErrorMessage(error, t("arena.coverImagesUpdateFailed", "Failed to update cover images."))
      );
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-[#0b0b0f] border border-[#2C2740] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-[#2C2740]">
          <DialogClose asChild disabled={isSaving}>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="cursor-pointer absolute top-4 right-4 flex items-center gap-1.5 text-[#9a98b8] hover:text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("common.cancel", "Cancel")}
              <span className="w-6 h-6 rounded-full border border-[#2C2740] flex items-center justify-center">
                <X size={12} />
              </span>
            </button>
          </DialogClose>

          <DialogTitle asChild>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
              {t("arena.manageCoverImagesTitle", "Manage Cover Images")}
            </h2>
          </DialogTitle>
          <DialogDescription asChild>
            <p className="text-[#9a98b8] text-xs sm:text-sm max-w-md">
              {t("arena.manageCoverImagesDesc", "Add new photos or remove existing ones from your cover slider.")}
            </p>
          </DialogDescription>
        </div>

        <div className="p-6 space-y-6">
          {/* Section: Existing Images */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/80">
              {t("arena.currentImages", "Current Slider Images")} ({existingMedia.length})
            </h3>
            
            {existingMedia.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-[#2C2740] rounded-xl text-muted-foreground text-xs">
                {t("arena.noExistingImages", "No custom cover images uploaded yet.")}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {existingMedia.map((media: any) => {
                  const isMarkedForDelete = deletedIds.includes(media.id);
                  const absoluteUrl = toAbsoluteMediaUrl(media.file_url);
                  
                  return (
                    <div
                      key={media.id}
                      className={`relative aspect-video rounded-lg overflow-hidden border transition-all duration-300 ${
                        isMarkedForDelete
                          ? "border-destructive scale-98 brightness-75"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <img
                        src={absoluteUrl || ""}
                        alt="Arena Cover"
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isMarkedForDelete ? "blur-[2px]" : ""
                        }`}
                      />

                      {/* Primary Badge */}
                      {media.is_primary && !isMarkedForDelete && (
                        <div className="absolute top-2 left-2 bg-custom-yellow/90 backdrop-blur-xs text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                          {t("arena.primaryImage", "Primary")}
                        </div>
                      )}

                      {/* Delete Overlay */}
                      {isMarkedForDelete && (
                        <div className="absolute inset-0 bg-destructive/40 flex flex-col items-center justify-center text-white p-2">
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-black/60 px-2 py-1 rounded">
                            {t("arena.markedForDeletion", "To Delete")}
                          </span>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => toggleDeleteExisting(media.id)}
                        disabled={isSaving}
                        className={`absolute top-2 right-2 p-1.5 rounded-md backdrop-blur-md transition-all shadow-md cursor-pointer border ${
                          isMarkedForDelete
                            ? "bg-emerald-500/80 border-emerald-400 text-white hover:bg-emerald-600"
                            : "bg-black/50 border-white/10 text-[#d1cfe8] hover:text-white hover:bg-red-500/80 hover:border-red-400"
                        }`}
                        title={isMarkedForDelete ? t("arena.undoDelete", "Undo Delete") : t("arena.deleteImage", "Delete Image")}
                      >
                        {isMarkedForDelete ? (
                          <RotateCcw className="w-3.5 h-3.5" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Upload Queue & Upload Trigger */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/80">
                {t("arena.uploadNewImages", "Add New Images")}
              </h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
                disabled={isSaving}
              />
            </div>

            {/* Drag and Drop Zone / Trigger box */}
            <div
              onClick={triggerFileInput}
              className={`group/upload border-2 border-dashed border-[#2C2740] hover:border-custom-yellow/40 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 bg-[#0c0c11]/50 hover:bg-[#12121c]/30 flex flex-col items-center justify-center gap-2 ${
                isSaving ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white/5 group-hover/upload:bg-custom-yellow/10 flex items-center justify-center text-white/60 group-hover/upload:text-custom-yellow transition-all duration-300 shadow-inner">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-semibold text-white/90 group-hover/upload:text-white transition-colors">
                  {t("arena.dragAndDropClick", "Click to select cover photos")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {t("arena.uploadLimits", "PNG, JPG or JPEG formats up to 10MB")}
                </p>
              </div>
            </div>

            {/* Uploading Previews Grid */}
            {newPreviews.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-white/60">
                  {t("arena.queuedUploads", "Queued for upload")} ({newPreviews.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {newPreviews.map((preview, index) => (
                    <div
                      key={preview + index}
                      className="relative aspect-video rounded-lg overflow-hidden border border-custom-yellow/20 bg-black/40 group/queued shadow-md"
                    >
                      <img
                        src={preview}
                        alt="Queued Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-emerald-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
                        {t("arena.newBadge", "New")}
                      </div>

                      {/* Remove from Queue button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        disabled={isSaving}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 border border-white/10 text-white/80 hover:text-white hover:bg-red-500/80 hover:border-red-400 backdrop-blur-md transition-all shadow-md cursor-pointer disabled:opacity-50"
                        title={t("arena.removeNewImage", "Remove from upload list")}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2C2740] bg-[#0c0c11]/80">
          <DialogClose asChild disabled={isSaving}>
            <Button
              variant="outline"
              disabled={isSaving}
              className="h-10 text-xs sm:text-sm px-4 bg-transparent border-[#2C2740] text-white hover:bg-white/5"
            >
              {t("common.cancel", "Cancel")}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || (deletedIds.length === 0 && newFiles.length === 0)}
            className="h-10 text-xs sm:text-sm px-5 bg-custom-yellow text-black font-semibold hover:bg-custom-yellow/95 transition-all shadow-md shadow-custom-yellow/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("common.saving", "Saving...")}
              </>
            ) : (
              t("common.saveChanges", "Save Changes")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
