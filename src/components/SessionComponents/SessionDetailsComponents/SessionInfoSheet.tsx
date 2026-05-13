/** @format */

"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCancelOwnerSessionMatchMutation,
  useGetOwnerSessionInfoQuery,
  useStartOwnerSessionMatchMutation,
  useSubmitOwnerSessionResultMutation,
} from "@/redux/features/sessions/sessionsAPI";
import SessionInfoSheetLoading from "@/components/SessionComponents/SessionDetailsComponents/SessionInfoSheetLoading";
import { toast } from "react-toastify";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface SessionInfoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: number | null;
}

const SessionInfoSheet: React.FC<SessionInfoSheetProps> = ({
  open,
  onOpenChange,
  sessionId,
}) => {
  const { t } = useTranslation("dashboard");
  const [teamAResult, setTeamAResult] = useState<"win" | "loss" | "draw">(
    "win",
  );

  const { data, isLoading, isFetching, isError } = useGetOwnerSessionInfoQuery(
    sessionId as number,
    {
      skip: !open || sessionId === null,
    },
  );

  const [startMatch, { isLoading: isStartingMatch }] =
    useStartOwnerSessionMatchMutation();
  const [cancelMatch, { isLoading: isCancellingMatch }] =
    useCancelOwnerSessionMatchMutation();
  const [submitResult, { isLoading: isSubmittingResult }] =
    useSubmitOwnerSessionResultMutation();

  const details = data?.data;
  const currentStatus = details?.status?.toLowerCase();
  const isOpenStatus = currentStatus === "open";
  const isOngoingStatus = currentStatus === "ongoing";
  const isCompletedOrCancelled =
    currentStatus === "completed" ||
    currentStatus === "complete" ||
    currentStatus === "cancelled" ||
    currentStatus === "canceled";

  const teamBResult: "win" | "loss" | "draw" =
    teamAResult === "draw" ? "draw" : teamAResult === "win" ? "loss" : "win";

  const updateFromTeamA = (result: "win" | "loss" | "draw") => {
    setTeamAResult(result);
  };

  const updateFromTeamB = (result: "win" | "loss" | "draw") => {
    if (result === "draw") {
      setTeamAResult("draw");
      return;
    }

    setTeamAResult(result === "win" ? "loss" : "win");
  };

  const handleStartMatch = async () => {
    if (!sessionId) return;

    try {
      const response = await startMatch(sessionId).unwrap();
      toast.success(getSuccessMessage(response, "Match started successfully."));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to start match."));
    }
  };

  const handleCancelMatch = async () => {
    if (!sessionId) return;

    try {
      const response = await cancelMatch(sessionId).unwrap();
      toast.success(
        getSuccessMessage(response, "Match cancelled successfully."),
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to cancel match."));
    }
  };

  const handleSubmitTeamResult = async () => {
    if (!sessionId) return;

    try {
      const response = await submitResult({
        sessionId,
        payload: {
          team_a_result: teamAResult,
          team_b_result: teamBResult,
        },
      }).unwrap();
      toast.success(
        getSuccessMessage(response, "Final result submitted successfully."),
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to submit final result."));
    }
  };

  if (!open) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-lg bg-card border-l border-white/10 overflow-y-auto p-0"
      >
        {/* Header */}
        <SheetHeader className="p-5 pb-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onOpenChange(false)}
              className="cursor-pointer p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-md border ${
                details?.status?.toLowerCase() === "open"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-secondary/20 text-secondary border-secondary/30"
              }`}
            >
              {details?.status_display ?? "Status"}
            </span>
          </div>
          <SheetTitle className="text-xl font-bold text-primary ">
            {t("sessions.details.viewInfo")}
          </SheetTitle>
          <SheetDescription className="text-sm text-secondary">
            {t("sessions.details.title")}
          </SheetDescription>
        </SheetHeader>

        {isLoading || isFetching ? <SessionInfoSheetLoading /> : null}

        {isError ? (
          <div className="px-5 py-6 text-sm text-destructive">
            {t("sessions.details.loadFailed")}
          </div>
        ) : null}

        {details ? (
          <div className="px-5">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">
                Field Info
              </h3>
              <div>
                <InfoRow label="Field ID" value={details.field_info.field_id} />
                <InfoRow
                  label="Field Name"
                  value={details.field_info.field_name}
                />
                <InfoRow label="Location" value={details.field_info.location} />
                <InfoRow
                  label="Contact Number"
                  value={details.field_info.contact_number}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-primary mb-3">
                Session Info
              </h3>
              <div>
                <InfoRow
                  label="Session ID"
                  value={details.session_info.session_id}
                />
                <InfoRow
                  label="Match Type"
                  value={
                    <span className="flex items-center gap-2 justify-end">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          details.session_info.match_type.toLowerCase() ===
                          "ranked"
                            ? "bg-custom-red"
                            : "bg-custom-yellow"
                        }`}
                      />
                      {details.session_info.match_type_display}
                    </span>
                  }
                />
                <InfoRow
                  label="Session Date"
                  value={details.session_info.session_date}
                />
                <InfoRow label="Time" value={details.session_info.time} />
                <InfoRow
                  label="Session Type"
                  value={details.session_info.session_type}
                />
                <InfoRow
                  label="Team"
                  value={details.session_info.team ?? "N/A"}
                />
                <InfoRow
                  label="Player Per Team"
                  value={details.session_info.player_per_team}
                />
                <InfoRow
                  label="Packages"
                  value={details.session_info.packages}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-primary mb-3">
                Team Info
              </h3>
              <div>
                <InfoRow
                  label="Team A Name"
                  value={details.team_info.team_a_name}
                />
                <InfoRow
                  label="Team A Score"
                  value={String(details.team_info.team_a_score)}
                />
                <InfoRow
                  label="Team B Name"
                  value={details.team_info.team_b_name}
                />
                <InfoRow
                  label="Team B Score"
                  value={String(details.team_info.team_b_score)}
                />
                <InfoRow label="Champion" value={details.team_info.champion} />
              </div>
            </div>
          </div>
        ) : null}

        {details && isOngoingStatus ? (
          <div className="px-5 pt-2 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">Team Result</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultSelector
                  title={details.team_info.team_a_name}
                  value={teamAResult}
                  onChange={updateFromTeamA}
                />
                <ResultSelector
                  title={details.team_info.team_b_name}
                  value={teamBResult}
                  onChange={updateFromTeamB}
                />
              </div>
            </div>
          </div>
        ) : null}

        {details && !isCompletedOrCancelled ? (
          <SheetFooter className="px-5 pb-5 pt-2 flex-row gap-3">
            {isOpenStatus ? (
              <>
                <Button
                  onClick={handleCancelMatch}
                  disabled={
                    !details.actions.can_cancel_match || isCancellingMatch
                  }
                  className="flex-1 py-2.5 bg-transparent rounded-lg border border-white/10 text-primary text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  {isCancellingMatch
                    ? `${t("common.loading")}`
                    : "Match Cancel"}
                </Button>
                <Button
                  onClick={handleStartMatch}
                  disabled={!details.actions.can_start_match || isStartingMatch}
                  className="flex-1 disabled:opacity-50"
                >
                  {isStartingMatch
                    ? `${t("common.loading")}`
                    : (details.actions.primary_button ?? "Match Start")}
                </Button>
              </>
            ) : null}

            {isOngoingStatus ? (
              <Button
                onClick={handleSubmitTeamResult}
                disabled={
                  !details.actions.can_submit_final_result || isSubmittingResult
                }
                className="w-full disabled:opacity-50"
              >
                {isSubmittingResult
                  ? `${t("common.loading")}`
                  : "Submit Final Result"}
              </Button>
            ) : null}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

const ResultSelector = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value: "win" | "loss" | "draw";
  onChange: (value: "win" | "loss" | "draw") => void;
}) => {
  const options: Array<"win" | "loss" | "draw"> = ["win", "loss", "draw"];

  return (
    <div className="bg-[#0c0a0c] border border-white/5 rounded-xl p-2 space-y-2">
      <p className="text-xs text-secondary">{title}</p>
      <div className="flex gap-1">
        {options.map((option) => (
          <button
            key={`${title}-${option}`}
            onClick={() => onChange(option)}
            className={cn(
              "flex-1 py-1.5 cursor-pointer text-xs font-semibold rounded-md transition-all",
              value === option
                ? "bg-[#e2b83b] text-black shadow-md"
                : "text-secondary hover:text-white",
            )}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 py-1.5 border-b border-white/5 last:border-0">
    <span className="text-sm text-secondary whitespace-nowrap">{label}</span>
    <span className="text-sm text-primary text-right">{value}</span>
  </div>
);

export default SessionInfoSheet;
