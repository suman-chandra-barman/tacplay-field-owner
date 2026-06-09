/** @format */

"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/CommonComponents/DashboardSidebar";
import NavBar from "@/components/CommonComponents/NabBar";
import { isPublicAuthPath } from "@/lib/public-auth-paths";
import { useGetArenaInfoQuery } from "@/redux/features/arenaManagement/arenaManagementAPI";
import "react-toastify/dist/ReactToastify.css";

const toastContainerProps = {
  position: "top-center" as const,
  autoClose: 4200,
  limit: 4,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  draggablePercent: 60,
  pauseOnHover: true,
  theme: "dark" as const,
  className: "!p-3",
  toastClassName:
    "!bg-card/95 !backdrop-blur-md !border !border-white/10 !text-primary !rounded-xl !shadow-xl !min-h-0",
  bodyClassName: "!p-0 !m-0 !items-start",
  progressClassName: "!bg-custom-red",
};

function ProfileSetupGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { error, isLoading } = useGetArenaInfoQuery();

  useEffect(() => {
    if (error && "status" in error) {
      const status = error.status;
      const errorData = error.data as Record<string, unknown> | undefined;
      const message = typeof errorData?.message === "string" ? errorData.message : undefined;
      if (status === 404 || message === "Arena info not found.") {
        router.push("/profile-setup");
      }
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-root-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-custom-red border-white/10 rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Checking profile status...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname ? isPublicAuthPath(pathname) : false;

  return (
    <>
      {isAuthPage ? (
        <div className="bg-root-bg min-h-screen">{children}</div>
      ) : (
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset className="overflow-x-hidden">
            <div className="bg-root-bg min-h-screen ">
              <NavBar />
              <ProfileSetupGuard>{children}</ProfileSetupGuard>
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
      <ToastContainer {...toastContainerProps} />
    </>
  );
}

