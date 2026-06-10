/** @format */
"use client";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

import Image from "next/image";
import Link from "next/link";
import { cn, getPlanDisplayName } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Settings, Crown } from "lucide-react";
import { Button } from "../ui/button";
import LogoutModal from "./LogOutModal";
import UpgradeModal from "./UpgradeModal";
import { CiTrophy } from "react-icons/ci";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiMoneyWithdraw } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import { useLogoutMutation } from "@/redux/features/auth/authAPI";
import { useAppDispatch } from "@/redux/hooks";
import { clearAuthSession } from "@/redux/features/auth/authSlice";
import { useEffect } from "react";
import {
  clearAuthTokens,
  getErrorMessage,
  getSuccessMessage,
} from "@/lib/auth";
import { toast } from "react-toastify";
import { useGetFieldOwnerSubscriptionStatusQuery } from "@/redux/features/subscriptions/subscriptionsAPI";
import { useTranslation } from "react-i18next";

export default function DashboardSidebar() {
  const { t } = useTranslation("dashboard");
  const { state } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [logout] = useLogoutMutation();
  const { data: subscriptionStatus } =
    useGetFieldOwnerSubscriptionStatusQuery(undefined);

  const isCollapsed = state === "collapsed";
  const currentSubscription = subscriptionStatus?.data;

  useEffect(() => {
    if (currentSubscription?.show_upgrade_popup) {
      setIsUpgradeModalOpen(true);
    }
  }, [currentSubscription?.show_upgrade_popup]);

  const navItems = [
    {
      href: "/",
      icon: LayoutGrid,
      label: t("common.dashboard"),
    },
    {
      href: "/sessions",
      icon: CiTrophy,
      label: t("sidebar.sessions"),
    },
    {
      href: "/booking-list",
      icon: IoDocumentTextOutline,
      label: t("sidebar.bookingList"),
    },
    {
      href: "/earnings",
      icon: BiMoneyWithdraw,
      label: t("sidebar.earnings"),
    },
    {
      href: "/arena-management",
      icon: GrUserManager,
      label: t("sidebar.arenaManagement"),
    },
    {
      href: "/settings",
      icon: Settings,
      label: t("common.settings"),
    },
  ];

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      toast.success(getSuccessMessage(response, "Logged out successfully"));
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Logout failed, clearing local session"),
      );
    } finally {
      clearAuthTokens();
      dispatch(clearAuthSession());
      setIsLogoutModalOpen(false);
      router.push("/sign-in");
    }
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
    <>
      {/* mobile menu button */}
      {/* <div className="fixed top-10 bg-gray-200 rounded-sm left-8 z-40 md:hidden">
        <SidebarTrigger />
      </div> */}

      {/* Sidebar content goes here */}
      <Sidebar
        className={`shadow-none  py-4  bg-root-bg border-r border-none ${isCollapsed ? "px-1" : "px-4"}`}
        collapsible="icon"
      >
        <SidebarContent
          className={`bg-background  border-t-2 border-l-2 border-r-2 border-[#2C2740] shadow-neutral-600 rounded-t-4xl
                      ${isCollapsed ? "px-0.5" : "px-2"}`}
        >
          <div
            className={`mb-6  flex  items-center justify-center rounded-md   ${
              isCollapsed
                ? " flex items-center w-full justify-center mx-auto p-1 "
                : "gap-2"
            }`}
          >
            <Link href="/" className="flex gap-2 ">
              {isCollapsed ? (
                <Image src="/logo.png" alt="Logo" width={40} height={40} />
              ) : (
                <div className="mt-2 flex items-center gap-2 h-10 ">
                  <Image
                    src="/Tacplay-logo-2.png"
                    alt="Logo"
                    width={120}
                    height={120}
                    className="w-40 h-10"
                    priority
                  />
                </div>
              )}
            </Link>
            {/* Toggle button for mobile */}

            {/* Collapse button for desktop */}
            {/* <div
              className={`absolute top-6 hidden md:block ${
                isCollapsed ? "right-2" : "right-2"
              }`}
            >
              <SidebarTrigger className="text-white hover:bg-transparent hover:text-white" />
            </div> */}
          </div>
          <SidebarMenu
            className={
              isCollapsed ? "px-2 space-y-1 items-center" : "md:px-1 space-y-1"
            }
          >
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={
                  !!(
                    pathname === item.href ||
                    pathname?.startsWith(item.href + "/")
                  )
                }
                collapsed={isCollapsed}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="pb-16 bg-background rounded-b-4xl border-r-2 border-b-2 border-l-2 border-[#2C2740] shadow-neutral-600">
          {/* Upgrade Banner */}
          {isCollapsed ? (
            <div className="flex justify-center mb-2">
              <Button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-br from-[#980009] to-[#C00069] border-2 border-[#cdba20] shadow-lg"
                title={t("sidebar.upgradeToPremium")}
              >
                <Crown size={18} className="text-[#cdba20]" />
              </Button>
            </div>
          ) : (
            <div className="mx-2 mb-3 rounded-2xl border border-[#C00069] bg-[#100F17] p-3 shadow-[0_0_12px_rgba(192,0,105,0.25)]">
              <div className="flex items-center gap-3 mb-3">
                {/* Seal badge */}
                <div className="relative shrink-0">
                  <div
                    className="w-12 h-12 bg-[#980009] flex items-center justify-center"
                    style={{
                      clipPath:
                        "polygon(50% 0%,61% 15%,79% 9%,75% 28%,93% 35%,82% 50%,93% 65%,75% 72%,79% 91%,61% 85%,50% 100%,39% 85%,21% 91%,25% 72%,7% 65%,18% 50%,7% 35%,25% 28%,21% 9%,39% 15%)",
                    }}
                  >
                    <Crown size={20} className="text-[#cdba20]" />
                  </div>
                </div>
                <div>
                  <p className="text-primary text-sm font-semibold leading-snug mb-0.5">
                    {currentSubscription?.has_active_subscription
                      ? t("sidebar.currentPlan", {
                          plan:
                            getPlanDisplayName(currentSubscription.plan_name, t) ??
                            t("sidebar.active"),
                        })
                      : t("sidebar.upgradeToSilver")}
                  </p>
                  <p className="text-secondary text-xs mb-2">
                    {currentSubscription?.has_active_subscription
                      ? t("sidebar.daysLeft", {
                          days: currentSubscription.days_left ?? 0,
                          status: currentSubscription.status
                        })
                      : t("sidebar.unlockMessage")}
                  </p>
                  <Button
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#980009] via-[#C00069] to-[#980009] text-white font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-[0_0_10px_rgba(192,0,105,0.4)]"
                  >
                    <Crown size={15} className="text-[#cdba20]" />
                    {currentSubscription?.has_active_subscription
                      ? t("sidebar.manage")
                      : t("sidebar.upgrade")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          {/* <div className="w-full flex justify-center">
            <Button
              variant="default"
              size="sm"
              className={cn(
                "flex text-black grow items-center justify-center bg-gray-50 font-medium hover:bg-[#F5E9EA] hover:text-[#9E2729]",
                isCollapsed
                  ? "rounded-md w-8 h-8 p-0"
                  : "h-10 md:h-12 w-full gap-2 rounded-md p-3",
              )}
              onClick={() => setIsLogoutModalOpen(true)}
            >
              {isCollapsed ? (
                <LogOut size={20} />
              ) : (
                <>
                  <LogOut size={18} />
                  <span className="text-base">Log Out</span>
                </>
              )}
            </Button>
          </div> */}
        </SidebarFooter>
      </Sidebar>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  collapsed?: boolean;
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  collapsed = false,
}: NavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          href={href}
          className={cn(
            collapsed
              ? "flex items-center justify-center px-2 py-3 transition-colors rounded-full w-12 h-10 mx-auto"
              : "flex items-center gap-3 h-10 md:h-10 rounded-md p-3 transition-colors text-sm",
            active
              ? "bg-custom-red  text-primary hover:bg-custom-red! hover:text-white! font-medium border-4 border-border shadow-md"
              : "text-secondary  hover:bg-transparent! hover:text-primary!  font-medium",
          )}
        >
          <Icon size={collapsed ? 20 : 18} />
          {!collapsed && <span className="text-base">{label}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
// ...existing code...
