/** @format */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toAbsoluteMediaUrl = (url: string | null | undefined) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!apiBaseUrl) return url;

  return `${apiBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export function getPlanDisplayName(planName: string | null | undefined, t: any): string | null | undefined {
  if (!planName) return planName;
  const normalized = planName.trim().toLowerCase();
  if (normalized === "bronze plan" || normalized === "bronze") {
    return t("upgradeModal.plans.bronze", "Essential Starter for Fields");
  }
  if (normalized === "silver plan" || normalized === "silver") {
    return t("upgradeModal.plans.silver", "Essential for Field Growth.");
  }
  if (normalized === "gold plan" || normalized === "gold") {
    return t("upgradeModal.plans.gold", planName);
  }
  return planName;
}

