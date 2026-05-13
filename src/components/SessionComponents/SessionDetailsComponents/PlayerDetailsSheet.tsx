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
import { cn } from "@/lib/utils";
import {
  useCheckInOwnerSessionPlayersMutation,
  useGetOwnerSessionPlayerInfoQuery,
  useSubmitOwnerSessionResultMutation,
} from "@/redux/features/sessions/sessionsAPI";
import PlayerDetailsSheetLoading from "@/components/SessionComponents/SessionDetailsComponents/PlayerDetailsSheetLoading";
import { toast } from "react-toastify";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";
import { useTranslation } from "react-i18next";

interface PlayerDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: number | null;
  bookingId: number | null;
}

const PlayerDetailsSheet: React.FC<PlayerDetailsSheetProps> = ({
  open,
  onOpenChange,
  sessionId,
  bookingId,
}) => {
  const { t } = useTranslation("dashboard");
  const [matchStatus, setMatchStatus] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError } =
    useGetOwnerSessionPlayerInfoQuery(
      { sessionId: sessionId as number, bookingId: bookingId as number },
      { skip: !open || sessionId === null || bookingId === null },
    );

  const details = data?.data;
  const scoreManagement = details?.score_management;
  const resultDisplay = scoreManagement?.result_display;

  const statusTone = scoreManagement?.checked_in
    ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
    : "bg-custom-yellow/20 text-yellow-400 border-custom-yellow/30";

  const normalizedStatus = resultDisplay
    ? resultDisplay.charAt(0).toUpperCase() +
      resultDisplay.slice(1).toLowerCase()
    : "Pending";

  const statusOptions = ["Win", "Loss", "Draw"];
  const activeMatchStatus = matchStatus ?? normalizedStatus;

  const [checkInPlayers, { isLoading: isCheckingIn }] =
    useCheckInOwnerSessionPlayersMutation();
  const [submitResult, { isLoading: isSubmittingResult }] =
    useSubmitOwnerSessionResultMutation();

  const handleCheckIn = async () => {
    if (!sessionId || !details?.booking_id) return;

    try {
      const response = await checkInPlayers({
        sessionId,
        payload: {
          booking_ids: [details.booking_id],
        },
      }).unwrap();
      toast.success(
        getSuccessMessage(response, "Player check-in completed successfully."),
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to check in player."));
    }
  };

  const handleSubmitPlayerResult = async () => {
    if (!sessionId || !details?.booking_id) return;

    const normalized = activeMatchStatus.toLowerCase();
    if (!["win", "loss", "draw"].includes(normalized)) {
      toast.error("Please select a valid result before submitting.");
      return;
    }

    try {
      const response = await submitResult({
        sessionId,
        payload: {
          players: [
            {
              booking_id: details.booking_id,
              result: normalized as "win" | "loss" | "draw",
            },
          ],
        },
      }).unwrap();
      toast.success(
        getSuccessMessage(response, "Final result submitted successfully."),
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to submit player score."));
    }
  };

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
              className={`px-3 py-1 text-xs font-medium rounded-md border ${statusTone}`}
            >
              {scoreManagement?.checked_in ? "Checked-In" : "Not Checked-In"}
            </span>
          </div>
          <SheetTitle className="text-xl md:text-xl font-bold text-primary ">
            Player Details &amp; Score Management
          </SheetTitle>
          <SheetDescription className="text-sm text-secondary">
            {t("bookings.details.subtitle")}
          </SheetDescription>
        </SheetHeader>

        {isLoading || isFetching ? <PlayerDetailsSheetLoading /> : null}

        {isError ? (
          <div className="px-5 py-6 text-sm text-destructive">
            {t("sessions.details.loadFailed")}
          </div>
        ) : null}

        {details ? (
          <div className="px-5 pb-5">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">
                Player Info
              </h3>
              <div>
                <InfoRow
                  label="Team Name"
                  value={details.player_info.team_name}
                />
                <InfoRow
                  label="Player ID"
                  value={details.player_info.player_id}
                />
                <InfoRow
                  label="Player Name"
                  value={details.player_info.player_name}
                />
                <InfoRow label="Email" value={details.player_info.email} />
                <InfoRow
                  label="Contact Number"
                  value={details.player_info.contact_number}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-primary mb-3">
                Booking Info
              </h3>
              <div>
                <InfoRow
                  label="Booking ID"
                  value={details.booking_info.booking_id}
                />
                <InfoRow
                  label="Transaction ID"
                  value={details.booking_info.transaction_id}
                />
                <InfoRow label="Amount" value={details.booking_info.amount} />
                <InfoRow
                  label="Platform Fee"
                  value={details.booking_info.platform_fee}
                />
                <InfoRow
                  label="Net Profit"
                  value={details.booking_info.net_profit}
                />
                <InfoRow
                  label="Payment Method"
                  value={details.booking_info.payment_method}
                />
                <InfoRow
                  label="Date & Time"
                  value={details.booking_info.date_time}
                />
                <InfoRow
                  label="Payment Status"
                  value={
                    <span className="px-3 py-0.5 text-xs font-medium rounded-md bg-teal-500/20 text-teal-400 border border-teal-500/30">
                      {details.booking_info.payment_status}
                    </span>
                  }
                />
              </div>
            </div>

            {scoreManagement?.show_result_selector ? (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Score Management
                </h3>
                <div className="bg-[#0c0a0c] border border-white/5 rounded-2xl p-1.5 flex items-center">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => setMatchStatus(status)}
                      className={cn(
                        "flex-1 py-2 cursor-pointer text-sm font-semibold rounded-xl transition-all duration-200",
                        activeMatchStatus === status
                          ? "bg-[#e2b83b] text-black shadow-md"
                          : "text-secondary hover:text-white",
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Footer */}
        {details ? (
          <SheetFooter className="px-5 pb-5 pt-2 flex-row gap-3 justify-center">
            {scoreManagement?.show_check_in_button ? (
              <Button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className="flex-1 py-2.5 rounded-lg bg-custom-yellow text-black text-sm font-medium hover:bg-custom-yellow/80 transition-colors disabled:opacity-50"
              >
                {isCheckingIn ? "Checking In..." : "Checked In"}
              </Button>
            ) : null}

            {scoreManagement?.show_result_selector &&
            scoreManagement?.show_submit_button ? (
              <Button
                onClick={handleSubmitPlayerResult}
                disabled={isSubmittingResult}
                className="flex-1 py-2.5 rounded-lg bg-custom-red text-white text-sm font-medium hover:bg-custom-red/80 transition-colors disabled:opacity-50"
              >
                {isSubmittingResult ? "Submitting..." : "Score Submit"}
              </Button>
            ) : null}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
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

export default PlayerDetailsSheet;
