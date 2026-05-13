/** @format */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import headTitle from "../../../public/heading-up.png"


const slides = [
  {
    title: "Command Your Arena",
    description:
      "Set up your field, schedule tactical sessions, and manage competitive paintball events with full control.",
  },
  {
    title: "Manage Your Battles",
    description:
      "Organize ranked and social matches, track player stats, and build your arena's competitive reputation.",
  },
  {
    title: "Grow Your Community",
    description:
      "Attract new players, manage bookings, and create memorable paintball experiences at your field.",
  },
];

interface AuthBannerProps {
  children: React.ReactNode;
}

const AuthBanner: React.FC<AuthBannerProps> = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-root-bg">
      {/* Left Banner - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col">
        {/* Logo */}
        <div className="absolute top-6 left-6 z-10">
          <Image
            src="/TACPLAY Logo.png"
            alt="TacPlay Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Banner Image */}
        <div className="relative flex-1 m-4 rounded-2xl overflow-hidden">
          <Image
            src="/banner.jpg"
            alt="Arena Banner"
            fill
            className="object-cover"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2">
              {slides[currentSlide].title}
            </h2>
            <p className="text-sm text-white/70 max-w-md">
              {slides[currentSlide].description}
            </p>

            {/* Slider dots */}
            <div className="flex gap-2 mt-5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "w-8 bg-white" : "w-4 bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Tagline */}
            <div className="mt-6">
              <Image
                src={headTitle}
                alt="Tagline"
                width={300}
                height={10}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthBanner;
