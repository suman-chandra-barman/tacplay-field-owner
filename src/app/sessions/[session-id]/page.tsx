/** @format */

"use client";

import React, { useState } from "react";
import { ArrowLeft, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import SessionInfoSheet from "@/components/SessionComponents/SessionDetailsComponents/SessionInfoSheet";
import EditSessionSheet from "@/components/SessionComponents/SessionDetailsComponents/EditSessionSheet";
import PlayerDetailsSheet from "@/components/SessionComponents/SessionDetailsComponents/PlayerDetailsSheet";
import PlayerCard from "@/components/SessionComponents/SessionDetailsComponents/PlayerCard";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useGetOwnerSessionDetailsQuery } from "@/redux/features/sessions/sessionsAPI";
import { toAbsoluteMediaUrl } from "@/lib/utils";
import SessionDetailsLoading from "@/components/SessionComponents/SessionDetailsComponents/SessionDetailsLoading";
import type { SessionPlayerCardModel } from "@/components/SessionComponents/SessionDetailsComponents/PlayerCard";
import { useTranslation } from "react-i18next";

const SessionDetailsPage = () => {
  const { t } = useTranslation("dashboard");
  const params = useParams();
  const sessionIdParam = params
    ? Array.isArray(params["session-id"])
      ? params["session-id"][0]
      : params["session-id"]
    : undefined;
  const sessionId = Number(sessionIdParam);

  const isValidSessionId = Number.isFinite(sessionId) && sessionId > 0;

  const { data, isLoading, isFetching, isError } =
    useGetOwnerSessionDetailsQuery(sessionId, { skip: !isValidSessionId });

  const [sessionInfoOpen, setSessionInfoOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [playerDetailsOpen, setPlayerDetailsOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );

  const details = data?.data;

  const teamAPlayers: SessionPlayerCardModel[] = details?.team_a_players
    ? details.team_a_players.map((player) => ({
        id: player.player_id,
        bookingId: player.booking_id,
        name: player.name,
        win: player.wins.count,
        loses: player.losses.count,
        played: player.wins.count + player.losses.count + player.draws.count,
        rank: player.rank,
        score: player.awarded_score,
        image: toAbsoluteMediaUrl(player.image),
        team: "A",
      }))
    : [];

  const teamBPlayers: SessionPlayerCardModel[] = details?.team_b_players
    ? details.team_b_players.map((player) => ({
        id: player.player_id,
        bookingId: player.booking_id,
        name: player.name,
        win: player.wins.count,
        loses: player.losses.count,
        played: player.wins.count + player.losses.count + player.draws.count,
        rank: player.rank,
        score: player.awarded_score,
        image: toAbsoluteMediaUrl(player.image),
        team: "B",
      }))
    : [];

  const handleViewPlayerDetails = (player: SessionPlayerCardModel) => {
    setSelectedBookingId(player.bookingId);
    setPlayerDetailsOpen(true);
  };

  if (!isValidSessionId) {
    return (
      <div className="w-full p-3 md:p-4">
        <div className="max-w-625 mx-auto text-sm text-destructive">
          {t("sessions.details.invalidId")}
        </div>
      </div>
    );
  }

  if ((isLoading || isFetching) && !details) {
    return <SessionDetailsLoading />;
  }

  if (isError || !details) {
    return (
      <div className="w-full p-3 md:p-4">
        <div className="max-w-625 mx-auto text-sm text-destructive">
          {t("sessions.details.loadFailed")}
        </div>
      </div>
    );
  }

  const teamALogo = toAbsoluteMediaUrl(details.top_summary.team_a.logo);
  const teamBLogo = toAbsoluteMediaUrl(details.top_summary.team_b.logo);

  return (
    <div className="w-full p-3 md:p-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/sessions">
              <button className="cursor-pointer p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-primary" />
              </button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              {t("sessions.details.title")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setEditOpen(true)}
              className="flex gap-2 bg-transparent border border-white/10 hover:bg-white/5 text-primary hover:text-white"
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("sessions.details.editButton")}
              </span>
            </Button>
            <Button
              onClick={() => setSessionInfoOpen(true)}
              className="flex gap-2"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("sessions.details.viewInfo")}
              </span>
            </Button>
          </div>
        </div>

        {/* Match Header Card */}
        <div className="rounded-xl relative overflow-hidden">
          <div className="bg-card rounded-xl relative overflow-hidden">
            {/* Match ID + Timer — skewed red box */}
            <div className="flex items-center justify-center ">
              <div
                className="bg-custom-red px-8 py-2"
                style={{
                  transform: "skewX(-20deg)",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                  boxShadow: "0 4px 12px rgba(152, 0, 9, 0.5)",
                }}
              >
                <div
                  className="flex items-center gap-3"
                  style={{ transform: "skewX(20deg)" }}
                >
                  <span className="text-white text-xs font-semibold">
                    {details.session_name}
                  </span>
                  <div className="w-px h-3 bg-white/30" />
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs sm:text-sm font-medium tabular-nums">
                      {details.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scoreboard */}
            <div className="relative border-4 border-border/20 rounded-4xl shadow-4xl shadow-amber-700">
              {/* Scoreboard content */}
              <div className="grid grid-cols-5 items-center px-3 py-5 sm:px-6 sm:py-8">
                {/* Team A Logo + Name */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-6  h-6 md:w-16 md:h-16 rounded-full overflow-hidden relative shrink-0">
                    {teamALogo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={teamALogo}
                        alt={details.top_summary.team_a.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="max-w-4 sm:max-w-6 md:max-w-none">
                    <p className="text-primary text-[10px] sm:text-xs font-semibold leading-tight">
                      {details.top_summary.team_a.name}
                    </p>
                  </div>
                </div>
                <div className="absolute right-[80%] top-0 bottom-0 w-px bg-linear-to-b from-transparent via-red-600 to-transparent transform -skew-x-20"></div>

                {/* Team A Score */}
                <div className="text-center">
                  <p className="text-primary text-xl sm:text-3xl lg:text-5xl font-black leading-none">
                    {details.top_summary.team_a.score}
                  </p>
                  <p className="text-muted-foreground text-[10px] sm:text-xs mt-1">
                    {t("sessions.details.score")}
                  </p>
                </div>
                <div className="absolute right-[60%] top-0 bottom-0 w-px bg-linear-to-b from-transparent via-red-600 to-transparent transform -skew-x-20"></div>

                {/* Center - Team Full */}
                <div className="text-center">
                  <p className="text-primary text-xl sm:text-3xl lg:text-5xl font-black leading-none">
                    {`${details.top_summary.team_full.team_a_capacity} / ${details.top_summary.team_full.team_b_capacity}`}
                  </p>
                  <p className="text-muted-foreground text-[10px] sm:text-xs mt-1">
                    {t("sessions.details.teamFull")}
                  </p>
                </div>
                <div className="absolute right-[40%] top-0 bottom-0 w-px bg-linear-to-b from-transparent via-red-600 to-transparent transform -skew-x-20"></div>

                {/* Team B Score */}
                <div className="text-center">
                  <p className="text-primary text-xl sm:text-3xl lg:text-5xl font-black leading-none">
                    {details.top_summary.team_b.score}
                  </p>
                  <p className="text-muted-foreground text-[10px] sm:text-xs mt-1">
                    {t("sessions.details.score")}
                  </p>
                </div>
                <div className="absolute right-[20%] top-0 bottom-0 w-px bg-linear-to-b from-transparent via-red-600 to-transparent transform -skew-x-20"></div>
                {/* Team B Logo + Name */}
                <div className="flex flex-col items-center gap-2 text-center ">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden relative shrink-0">
                    {teamBLogo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={teamBLogo}
                        alt={details.top_summary.team_b.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="max-w-4 sm:max-w-6 md:max-w-none">
                    <p className="text-primary text-[10px] sm:text-xs font-semibold leading-tight">
                      {details.top_summary.team_b.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column - Team A */}
          <div className="space-y-4">
            {teamAPlayers.map((player, index) => (
              <PlayerCard
                key={`teamA-${index}`}
                player={player}
                onViewDetails={handleViewPlayerDetails}
              />
            ))}
            {teamAPlayers.length === 0 ? (
              <div className="text-sm text-secondary">
                {t("sessions.details.noPlayersTeamA")}
              </div>
            ) : null}
          </div>

          {/* Right column - Team B */}
          <div className="space-y-4">
            {teamBPlayers.map((player, index) => (
              <PlayerCard
                key={`teamB-${index}`}
                player={player}
                onViewDetails={handleViewPlayerDetails}
              />
            ))}
            {teamBPlayers.length === 0 ? (
              <div className="text-sm text-secondary">
                {t("sessions.details.noPlayersTeamB")}
              </div>
            ) : null}
          </div>
        </div>

        {/* Sheets */}
        <SessionInfoSheet
          open={sessionInfoOpen}
          onOpenChange={setSessionInfoOpen}
          sessionId={sessionId}
        />
        <EditSessionSheet
          open={editOpen}
          onOpenChange={setEditOpen}
          sessionId={sessionId}
        />
        <PlayerDetailsSheet
          key={selectedBookingId ?? "session-player-sheet"}
          open={playerDetailsOpen}
          onOpenChange={setPlayerDetailsOpen}
          sessionId={sessionId}
          bookingId={selectedBookingId}
        />
      </div>
    </div>
  );
};

export default SessionDetailsPage;
