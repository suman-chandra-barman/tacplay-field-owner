/** @format */

"use client";

import React, { useState } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useGetBookingDetailsQuery } from "@/redux/features/bookingList/bookingListAPI";

interface BookingDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: number | null;
}

const BookingDetailsSheet: React.FC<BookingDetailsSheetProps> = ({
  open,
  onOpenChange,
  bookingId,
}) => {
  const { t } = useTranslation("dashboard");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading, isFetching, isError } = useGetBookingDetailsQuery(
    bookingId as number,
    { skip: !open || bookingId === null },
  );

  const details = data?.data;

  if (!open) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full sm:max-w-lg bg-card border-l border-white/10 overflow-y-auto p-0"
        >
          <SheetHeader className="p-5 pb-0">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onOpenChange(false)}
                className="cursor-pointer p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </button>
              <SheetTitle>{t("bookings.details.title")}</SheetTitle>
              <StatusBadge status={details?.booking.status ?? "pending"} />
            </div>
            <SheetDescription className="text-sm text-secondary">
              {t("bookings.details.subtitle")}
            </SheetDescription>
          </SheetHeader>
          <div className="px-5 pb-5">
            {isLoading || isFetching ? (
              <div className="py-6 text-sm text-muted-foreground">
                {t("bookings.details.loading")}
              </div>
            ) : isError ? (
              <div className="py-6 text-sm text-destructive">
                {t("bookings.details.loadFailed")}
              </div>
            ) : details ? (
              <>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-primary mb-3">
                    {t("bookings.details.playerInfo")}
                  </h3>
                  <div>
                    <InfoRow
                      label="Player ID"
                      value={details.player.display_player_id}
                    />
                    <InfoRow
                      label="Player Name"
                      value={details.player.full_name}
                    />
                    <InfoRow label="Email" value={details.player.email} />
                    <InfoRow
                      label="Contact Number"
                      value={details.player.contact_number ?? "-"}
                    />
                    <InfoRow label="Location" value={details.player.location} />
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-primary mb-3">
                    {t("bookings.details.sessionInfo")}
                  </h3>
                  <div>
                    <InfoRow
                      label="Session ID"
                      value={`#CH ${details.session.id}`}
                    />
                    <InfoRow
                      label="Session Name"
                      value={details.session.session_name}
                    />
                    <InfoRow
                      label="Arena Name"
                      value={details.session.field_name}
                    />
                    <InfoRow
                      label="Match Type"
                      value={
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${details.session.match_type.toLowerCase() === "ranked" ? "bg-custom-red" : "bg-custom-yellow"}`}
                          />
                          {details.session.match_type}
                        </span>
                      }
                    />
                    <InfoRow
                      label="Session Date"
                      value={details.session.match_date}
                    />
                    <InfoRow
                      label="Time"
                      value={`${details.session.start_time} to ${details.session.end_time}`}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-primary mb-3">
                    {t("bookings.details.paymentInfo")}
                  </h3>
                  <div>
                    <InfoRow
                      label="Booking ID"
                      value={details.booking.display_booking_id}
                    />
                    <InfoRow
                      label="Transaction Ref"
                      value={details.booking.payment_reference}
                    />
                    <InfoRow
                      label="Amount"
                      value={details.payment.total_amount_display}
                    />
                    <InfoRow
                      label="Platform Fee"
                      value={details.payment.commission_amount}
                    />
                    <InfoRow
                      label="Payment Method"
                      value={details.payment.payment_method}
                    />
                    <InfoRow
                      label="Payment Status"
                      value={
                        <StatusBadge status={details.booking.payment_status} />
                      }
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <SheetFooter className="px-5 pb-5 pt-2 justify-center">
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full py-2.5 rounded-lg bg-custom-red text-white text-sm font-medium hover:bg-custom-red/80 transition-colors"
            >
              {t("bookings.details.markCheckedIn")}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          showCloseButton={false}
          className="bg-card border border-white/10 max-w-sm"
        >
          <DialogHeader className="items-center">
            <div className="flex flex-col items-center gap-3">
              <AlertCircle className="w-6 h-6 text-custom-red" />
              <DialogTitle>{t("bookings.details.confirmCheckIn")}</DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              {t("bookings.details.confirmDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 sm:justify-center mt-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="flex-1 py-2.5 rounded-lg border border-white/10 text-primary text-sm font-medium hover:bg-white/5 transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={() => {
                setConfirmOpen(false);
              }}
              className="flex-1 py-2.5 rounded-lg bg-custom-red text-white text-sm font-medium hover:bg-custom-red/80 transition-colors"
            >
              {t("common.yesSure")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    paid: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    pending: "bg-custom-yellow/20 text-yellow-400 border-custom-yellow/30",
    open: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-custom-red/20 text-red-400 border-custom-red/30",
  };
  const colors =
    colorMap[status.toLowerCase()] ||
    "bg-secondary/20 text-secondary border-secondary/30";

  return (
    <span
      className={`px-3 py-0.5 text-xs font-medium rounded-md border ${colors}`}
    >
      {status}
    </span>
  );
};

export default BookingDetailsSheet;
