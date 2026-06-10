/** @format */

"use client";

import React, { useState, useEffect } from "react";
import { Crown, Shield, ChevronLeft, ChevronRight, X, Maximize2, Pen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BillingsTab from "@/components/ArenaManagementComponents/BillingsTab";
import { useGetArenaInfoQuery } from "@/redux/features/arenaManagement/arenaManagementAPI";
import { useGetFieldOwnerSubscriptionStatusQuery } from "@/redux/features/subscriptions/subscriptionsAPI";
import ArenaInfoTab from "@/components/ArenaManagementComponents/ArenaInfoTab";
import FieldSetupTab from "@/components/ArenaManagementComponents/FieldSetupTab";
import PackageManagementTab from "@/components/ArenaManagementComponents/PackageManagementTab";
import PayoutDetailsTab from "@/components/ArenaManagementComponents/PayoutDetailsTab";
import ArenaManagementLoading from "@/components/ArenaManagementComponents/ArenaManagementLoading";
import ManageCoverImagesModal from "@/components/ArenaManagementComponents/ManageCoverImagesModal";
import { toAbsoluteMediaUrl } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const ArenaManagementPage = () => {
  const { t } = useTranslation("dashboard");
  const { data, isLoading, isFetching } = useGetArenaInfoQuery();
  const { data: subscriptionStatus } = useGetFieldOwnerSubscriptionStatusQuery(undefined);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const currentPlan = subscriptionStatus?.data?.plan_name;
  const isBronze = currentPlan === "Bronze Plan" || subscriptionStatus?.data?.plan_code === "field_bronze_monthly";

  const arenaInfo = data?.data;
  const userInfo = arenaInfo?.user_info;
  const fullName = userInfo?.full_name || t("arena.arenaOwner");
  const email = userInfo?.email || "";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AO";

  const mediaList = arenaInfo?.media || [];
  const mappedUrls = mediaList
    .map((m) => toAbsoluteMediaUrl(m.file_url))
    .filter((url): url is string => !!url);
  const imageUrls = mappedUrls.length > 0 ? mappedUrls : ["/profile-cover.png"];

  const profileImageUrl = toAbsoluteMediaUrl(userInfo?.profile_image);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % imageUrls.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  // Auto-scroll images every 4 seconds
  useEffect(() => {
    if (imageUrls.length <= 1 || isLightboxOpen || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageUrls.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [imageUrls.length, isLightboxOpen, isHovered]);

  // Reset slide index if it is out of bounds (e.g., after deleting images)
  useEffect(() => {
    if (currentSlide >= imageUrls.length) {
      setCurrentSlide(Math.max(0, imageUrls.length - 1));
    }
  }, [imageUrls.length, currentSlide]);

  // Keyboard controls for lightbox and body scroll lock
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev + 1) % imageUrls.length);
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, imageUrls.length]);

  if ((isLoading || isFetching) && !arenaInfo) {
    return <ArenaManagementLoading />;
  }

  return (
    <div className="w-full pt-3 pb-6 md:pb-12 md:pt-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        {/* Cover Image Slider */}
        <div
          className="relative w-full h-40 sm:h-52 md:h-64 lg:h-72 overflow-hidden rounded-t-xl group/slider bg-muted"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Slides */}
          <div className="w-full h-full relative">
            {imageUrls.map((url, idx) => (
              <div
                key={url + idx}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  idx === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-95"
                } transform transition-all duration-700 overflow-hidden flex items-center justify-center`}
              >
                {/* Blurred backdrop image (Senior Designer ambient blur aesthetic) */}
                <img
                  src={url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 select-none pointer-events-none scale-110"
                />
                {/* Sharp foreground image */}
                <img
                  src={url}
                  alt={`Arena Cover ${idx + 1}`}
                  className="relative max-w-full max-h-full object-contain z-10 transition-transform duration-700 hover:scale-102 cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                />
              </div>
            ))}
            
            {/* Bottom Dark Gradient for Contrast */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
          </div>

          {/* Navigation controls - only if we have more than 1 image */}
          {imageUrls.length > 1 && (
            <>
              {/* Prev Arrow */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer shadow-lg"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer shadow-lg"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Counter Pill */}
              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-semibold bg-black/50 backdrop-blur-md border border-white/10 text-white select-none shadow-md">
                {currentSlide + 1} / {imageUrls.length}
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {imageUrls.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlide
                        ? "w-5 bg-custom-yellow shadow-md shadow-custom-yellow/50"
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Lightbox Maximize Trigger */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute left-4 top-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer shadow-md"
            aria-label="Maximize Cover View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Edit Cover Images Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsManageModalOpen(true);
            }}
            className="absolute right-4 top-4 z-20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all duration-300 sm:opacity-0 sm:group-hover/slider:opacity-100 opacity-100 cursor-pointer shadow-md text-xs font-semibold"
            aria-label="Manage Cover Images"
          >
            <Pen className="w-3.5 h-3.5" />
            {t("arena.editSliderImages", "Edit Slider")}
          </button>
        </div>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-300 cursor-pointer z-50 shadow-lg"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Slider Center Image */}
            <div
              className="relative w-full max-w-5xl h-[65vh] md:h-[75vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Frame */}
              <img
                src={imageUrls[currentSlide]}
                alt={`Arena Cover Full ${currentSlide + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-500 ease-in-out border border-white/10"
              />

              {imageUrls.length > 1 && (
                <>
                  {/* Prev Button */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/5 shadow-md"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/5 shadow-md"
                    aria-label="Next Image"
                  >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Controls & Thumbnails */}
            {imageUrls.length > 1 && (
              <div
                className="mt-6 flex flex-col items-center gap-4 z-40"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Thumbnails strip */}
                <div className="flex items-center justify-center gap-2 max-w-[90vw] overflow-x-auto py-1 px-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/5 shadow-inner">
                  {imageUrls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`relative w-12 h-9 sm:w-16 sm:h-12 rounded-lg overflow-hidden transition-all duration-300 border-2 cursor-pointer shrink-0 ${
                        idx === currentSlide
                          ? "border-custom-yellow scale-105 shadow-md shadow-custom-yellow/30"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Counter text */}
                <div className="text-white/60 text-xs sm:text-sm font-semibold select-none tracking-wider">
                  {currentSlide + 1} / {imageUrls.length}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Section */}
        <div className="relative z-20 px-4 sm:px-6 pb-4">
          {/* Avatar */}
          <div className="relative -mt-10 sm:-mt-12 md:-mt-14 mb-3 flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-card bg-muted overflow-hidden shrink-0">
                {profileImageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profileImageUrl}
                    alt={`${fullName} profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-custom-red/40 to-custom-yellow/40 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="pb-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                  {fullName}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {email}
                </p>
              </div>
            </div>

            {/* Pro Badge  that will be changed bassed on the package... silver-silver/ bronz- free / gold-gold*/}
            {!isBronze && (
              <div className="pb-1">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-custom-red text-white text-xs sm:text-sm font-semibold shadow-md shadow-custom-red/25"
                >
                  <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#cdba20]" />
                  {t("arena.pro")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="px-4 sm:px-6 pb-6">
          <Tabs defaultValue="arena-info" className="w-full">
            <TabsList
              variant="line"
              className="w-full justify-start overflow-x-auto border-b border-white/10 gap-0"
            >
              <TabsTrigger
                value="arena-info"
                className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm data-[state=active]:text-custom-yellow after:bg-custom-yellow whitespace-nowrap"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
                {t("arena.tabs.arenaInfo")}
              </TabsTrigger>
              <TabsTrigger
                value="field-setup"
                className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm data-[state=active]:text-custom-yellow after:bg-custom-yellow whitespace-nowrap"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
                {t("arena.tabs.fieldSetup")}
              </TabsTrigger>
              <TabsTrigger
                value="package-management"
                className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm data-[state=active]:text-custom-yellow after:bg-custom-yellow whitespace-nowrap"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
                {t("arena.tabs.packageManagement")}
              </TabsTrigger>
              <TabsTrigger
                value="payout-details"
                className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm data-[state=active]:text-custom-yellow after:bg-custom-yellow whitespace-nowrap"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
                {t("arena.tabs.payoutDetails")}
              </TabsTrigger>
              <TabsTrigger
                value="billings"
                className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm data-[state=active]:text-custom-yellow after:bg-custom-yellow whitespace-nowrap"
              >
                {t("arena.tabs.billings")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="arena-info" className="mt-6">
              <ArenaInfoTab />
            </TabsContent>
            <TabsContent value="field-setup" className="mt-6">
              <FieldSetupTab />
            </TabsContent>
            <TabsContent value="package-management" className="mt-6">
              <PackageManagementTab />
            </TabsContent>
            <TabsContent value="payout-details" className="mt-6">
              <PayoutDetailsTab />
            </TabsContent>
            <TabsContent value="billings" className="mt-6">
              <BillingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ManageCoverImagesModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        arenaInfo={arenaInfo}
      />
    </div>
  );
};

export default ArenaManagementPage;
