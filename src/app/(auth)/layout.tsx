"use client";

import React, { useEffect, useState } from "react";
import LanguageDropdown from "@/components/AuthComponents/LanguageDropdown";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-6 right-6 z-50">
        <LanguageDropdown />
      </div>
      {mounted ? children : null}
    </div>
  );
}

