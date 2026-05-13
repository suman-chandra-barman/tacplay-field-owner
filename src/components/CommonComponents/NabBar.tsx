/** @format */
"use client";

import { ChevronDown, Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCog, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import LogoutModal from "./LogOutModal";
import { SidebarTrigger } from "../ui/sidebar";
import { clearAuthTokens, type PersistedAuthUser } from "@/lib/auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAuthSession } from "@/redux/features/auth/authSlice";
import { toAbsoluteMediaUrl } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { changeAppLanguage, default as appI18n } from "@/i18n/init";
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/i18n/resources";

const noOpSubscribe = () => () => undefined;

const AUTH_USER_COOKIE_NAME = "tpAuthUser";

const getAuthUserCookieSnapshot = () => {
  if (typeof document === "undefined") {
    return null;
  }

  const nameWithEquals = `${AUTH_USER_COOKIE_NAME}=`;
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(nameWithEquals)) {
      return decodeURIComponent(trimmedCookie.substring(nameWithEquals.length));
    }
  }

  return null;
};

const getInitials = (name?: string) => {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const NavBar = () => {
  const { t } = useTranslation("dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const cookieUserSnapshot = useSyncExternalStore<string | null>(
    noOpSubscribe,
    getAuthUserCookieSnapshot,
    () => null,
  );

  const cookieUser = useMemo<PersistedAuthUser | null>(() => {
    if (!cookieUserSnapshot) return null;

    try {
      return JSON.parse(cookieUserSnapshot) as PersistedAuthUser;
    } catch {
      return null;
    }
  }, [cookieUserSnapshot]);

  const isHydrating = useSyncExternalStore<boolean>(
    noOpSubscribe,
    () => false,
    () => true,
  );

  const displayUser = useMemo(
    () => reduxUser ?? cookieUser,
    [reduxUser, cookieUser],
  );

  const displayName = displayUser?.full_name?.trim() || "User";
  const displayImage = toAbsoluteMediaUrl(displayUser?.profile_image);

  const currentLanguage = (SUPPORTED_LANGUAGES.find(
    (item) => item === appI18n.language,
  ) ?? "en") as SupportedLanguage;

  const pageTitle = useMemo(() => {
    if (!pathname) {
      return t("common.dashboard");
    }
    if (pathname === "/" || pathname.startsWith("/?")) {
      return t("common.dashboard");
    }
    if (pathname.startsWith("/sessions")) {
      return t("sidebar.sessions");
    }
    if (pathname.startsWith("/booking-list")) {
      return t("sidebar.bookingList");
    }
    if (pathname.startsWith("/earnings")) {
      return t("sidebar.earnings");
    }
    if (pathname.startsWith("/arena-management")) {
      return t("sidebar.arenaManagement");
    }
    if (pathname.startsWith("/settings")) {
      return t("common.settings");
    }

    return t("common.dashboard");
  }, [pathname, t]);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    clearAuthTokens();
    dispatch(clearAuthSession());
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/sign-in");
    router.refresh();
  };
  if (
    pathname == "/sign-in" ||
    pathname == "/sign-up" ||
    pathname == "/forgot-pass" ||
    pathname == "/create-new-pass" ||
    pathname == "/reset-pass" ||
    pathname == "/verify-email" ||
    pathname == "/verify-otp" ||
    pathname == "/profile-setup"
  )
    return null;
  return (
    <div className="w-full sticky top-0 z-9 px-3 md:px-4">
      <div className="max-w-625 rounded-2xl mx-auto flex items-center justify-between    py-3">
        <div className="flex gap-2 items-center justify-center">
          {/* mobile menu button */}
          <div className=" rounded-sm ">
            <SidebarTrigger />
          </div>
          {/* Left side - Title */}
          <h1 className="text-sm sm:text-base md:text-lg lg:text-2xl 2xl:text-3xl font-bold text-primary truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Right side - Profile */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer border border-transparent hover:border-secondary items-center gap-2 rounded-lg px-2 py-1 transition-colors shrink-0 text-primary text-xs sm:text-sm">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{t("language.label")}</span>
              <span className="font-semibold">
                {LANGUAGE_LABELS[currentLanguage]}
              </span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 border border-secondary bg-background rounded-lg shadow-lg"
            >
              {SUPPORTED_LANGUAGES.map((languageCode) => (
                <DropdownMenuItem
                  key={languageCode}
                  onClick={() => {
                    void changeAppLanguage(languageCode);
                  }}
                  className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer"
                >
                  <span className="text-base">
                    {t(`language.${languageCode}`)}
                  </span>
                  {currentLanguage === languageCode ? (
                    <span className="text-xs text-secondary">Selected</span>
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer border border-transparent hover:border-secondary items-center gap-1 sm:gap-2  rounded-lg px-1 sm:px-2 py-1 transition-colors shrink-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-800 flex items-center justify-center overflow-hidden shrink-0">
                {isHydrating ? (
                  <div className="w-full h-full animate-pulse bg-muted" />
                ) : displayImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayImage}
                    alt={t("navbar.profileAlt")}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs sm:text-sm font-semibold text-primary">
                    {getInitials(displayName)}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                {isHydrating ? (
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                ) : (
                  <p className="text-sm font-medium text-primary">
                    {displayName}
                  </p>
                )}
              </div>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-primary hidden sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 border border-secondary bg-background rounded-lg shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
              >
                <UserCog className="w-5 h-5 text-blue-500" />
                <span className="text-base">{t("navbar.menuSetting")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-base">{t("navbar.menuLogout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default NavBar;
