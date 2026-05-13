/** @format */
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface SessionPlayerCardModel {
  id: number;
  bookingId: number;
  name: string;
  win: number;
  loses: number;
  played: number;
  rank: number;
  score?: number;
  image: string | null;
  team: "A" | "B";
}

interface PlayerCardProps {
  player: SessionPlayerCardModel;
  onViewDetails: (player: SessionPlayerCardModel) => void;
}

const PlayerCard = ({ player, onViewDetails }: PlayerCardProps) => {
  const hasScore = player.score !== undefined;
  const isPositiveScore = hasScore && (player.score ?? 0) > 0;
  const isYellowTheme = player.team === "B";

  const frameGradient = isYellowTheme
    ? "bg-[linear-gradient(135deg,#6a4b08,#d4b122,#3f2f0b)]"
    : "bg-[linear-gradient(135deg,#5a0f1b,#d90f2f,#3b0c15)]";

  const cardGlow = isYellowTheme
    ? "shadow-[0_0_30px_rgba(221,180,29,0.25)]"
    : "shadow-[0_0_28px_rgba(217,15,47,0.35)]";

  const badgeTone = isYellowTheme ? "bg-[#e0b534]" : "bg-[#c01024]";
  const buttonTone = isYellowTheme
    ? "bg-custom-yellow text-black hover:bg-custom-yellow/90 border-custom-yellow/50"
    : "bg-[#b1001f] text-white hover:bg-[#d3002a]";
  const statNumberTone = isYellowTheme ? "text-[#ffe6a3]" : "text-white";
  const statLabelTone = isYellowTheme
    ? "text-[#c6aa65]"
    : "text-muted-foreground";

  return (
    <div className="relative">
      <div className={cn("relative rounded-3xl p-px", frameGradient, cardGlow)}>
        <div className="absolute inset-0 opacity-50 blur-3xl" aria-hidden>
          <div
            className={cn(
              "w-full h-full",
              isYellowTheme
                ? "bg-[radial-gradient(circle_at_15%_20%,rgba(255,200,64,0.3),transparent_45%),radial-gradient(circle_at_85%_0%,rgba(255,200,64,0.2),transparent_40%)]"
                : "bg-[radial-gradient(circle_at_15%_20%,rgba(220,32,64,0.4),transparent_45%),radial-gradient(circle_at_85%_0%,rgba(220,32,64,0.25),transparent_40%)]",
            )}
          />
        </div>

        <div className="relative flex gap-4 rounded-3xl bg-[#0c0a0c] p-3 sm:p-4">
          {/* Badge */}
          <div className="absolute -top-3 -left-3">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div
                className={cn(
                  "absolute -inset-1 rounded-full blur-lg",
                  badgeTone,
                  "opacity-70",
                )}
              />
              <div className={cn("absolute ")} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={"/player-badge.png"}
                alt="badge"
                className="relative w-10 h-10"
              />
            </div>
          </div>

          {/* Player image */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 ring-2 ring-white/10">
            {player.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={player.image}
                alt={`${player.name} avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-secondary text-sm font-semibold">
                {player.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Right content */}
          <div className="flex-1 min-w-0">
            {/* Top row */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <p className="text-white text-base sm:text-lg font-semibold truncate">
                {player.name}
              </p>
              <Button
                size="sm"
                className={cn(
                  "h-8 px-3 text-xs rounded-lg font-semibold shadow-md",
                  buttonTone,
                )}
                onClick={() => onViewDetails(player)}
              >
                View Details
              </Button>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-5 items-center pt-3 text-center gap-0">
              {["Win", "Loses", "Played", "Rank"].map((label, idx) => {
                const value = [
                  player.win,
                  player.loses,
                  player.played,
                  player.rank,
                ][idx];

                return (
                  <div
                    key={label}
                    className={cn(
                      "flex flex-col gap-0.5",
                      idx !== 0 && "border-l border-white/10",
                    )}
                  >
                    <span
                      className={cn(
                        "text-lg sm:text-xl font-black",
                        statNumberTone,
                      )}
                    >
                      {value}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] sm:text-xs uppercase tracking-[0.08em]",
                        statLabelTone,
                      )}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}

              <div className="flex flex-col gap-0.5 border-l border-white/10">
                <span
                  className={cn(
                    "text-lg sm:text-xl font-black",
                    !hasScore && "text-muted-foreground",
                    hasScore &&
                      (isPositiveScore ? "text-emerald-400" : "text-[#ff4d4f]"),
                  )}
                >
                  {hasScore
                    ? isPositiveScore
                      ? `+${player.score}`
                      : player.score
                    : "-"}
                </span>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs uppercase tracking-[0.08em]",
                    statLabelTone,
                  )}
                >
                  Score
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
