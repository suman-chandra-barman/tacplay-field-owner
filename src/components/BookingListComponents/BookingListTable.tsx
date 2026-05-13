/** @format */

"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomTable from "../CommonComponents/CustomTable";
import BookingDetailsSheet from "@/components/BookingListComponents/BookingDetailsSheet";
import BookingListLoading from "@/components/BookingListComponents/BookingListLoading";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setBookingListLimit,
  setBookingListPage,
} from "@/redux/features/bookingList/bookingListSlice";
import { useGetBookingListQuery } from "@/redux/features/bookingList/bookingListAPI";
import type { BookingListItem } from "@/types/BookingListTypes";

const BookingListTable = () => {
  const { t } = useTranslation("dashboard");
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.bookingList.page);
  const limit = useAppSelector((state) => state.bookingList.limit);

  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );

  const queryArgs = useMemo(
    () => ({ page, limit, search: search.trim() || undefined }),
    [limit, page, search],
  );

  const { data, isLoading, isFetching, isError } =
    useGetBookingListQuery(queryArgs);

  const rows = data?.data ?? [];
  const totalPage = data?.meta.totalPage ?? 1;
  const totalCount = data?.meta.total ?? rows.length;

  if ((isLoading || isFetching) && !data) {
    return <BookingListLoading />;
  }

  const matchTypeDot = (type: string) => {
    const isRanked = type.toLowerCase() === "ranked";
    return (
      <span className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${isRanked ? "bg-custom-red" : "bg-custom-yellow"}`}
        />
        {type}
      </span>
    );
  };

  const statusBadge = (value: string) => {
    const colorMap: Record<string, string> = {
      paid: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
      pending:
        "bg-custom-yellow/20 text-yellow-400 border border-custom-yellow/30",
      confirmed:
        "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      cancelled: "bg-custom-red/20 text-red-400 border border-custom-red/30",
    };
    const colors =
      colorMap[value.toLowerCase()] ||
      "bg-secondary/20 text-secondary border border-secondary/30";

    return (
      <span
        className={`px-2.5 py-0.5 text-xs font-medium rounded-md ${colors}`}
      >
        {value}
      </span>
    );
  };

  const columns = [
    {
      header: t("bookings.columns.bookingId"),
      accessor: (row: BookingListItem) => (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-custom-red" />
          {row.display_booking_id}
        </span>
      ),
    },
    {
      header: t("bookings.columns.playerName"),
      accessor: "player_name" as keyof BookingListItem,
    },
    {
      header: t("bookings.columns.sessionDate"),
      accessor: "match_date" as keyof BookingListItem,
    },
    {
      header: t("bookings.columns.matchType"),
      accessor: (row: BookingListItem) => matchTypeDot(row.match_type),
    },
    {
      header: t("bookings.columns.paymentStatus"),
      accessor: (row: BookingListItem) => statusBadge(row.payment_status),
    },
    {
      header: t("bookings.columns.team"),
      accessor: "team_display" as keyof BookingListItem,
    },
    {
      header: t("bookings.columns.status"),
      accessor: (row: BookingListItem) => statusBadge(row.status),
    },
  ];

  const handleAction = (row: BookingListItem) => {
    setSelectedBookingId(row.booking_id);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {t("bookings.title")}
        </h1>
        <p className="text-sm text-secondary mt-1">{t("bookings.subtitle")}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder={t("common.search")}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              dispatch(setBookingListPage(1));
            }}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-white/10 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-custom-yellow/50"
          />
        </div>
      </div>

      {isError ? (
        <div className="text-sm text-destructive">
          {t("bookings.loadFailed")}
        </div>
      ) : null}

      <CustomTable
        data={rows}
        columns={columns}
        onAction={handleAction}
        itemsPerPage={limit}
        serverPagination
        currentPage={page}
        totalPages={totalPage}
        additionalCount={totalCount}
        onPageChange={(nextPage) => dispatch(setBookingListPage(nextPage))}
        onItemsPerPageChange={(nextLimit) =>
          dispatch(setBookingListLimit(nextLimit))
        }
      />

      <BookingDetailsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        bookingId={selectedBookingId}
      />
    </div>
  );
};

export default BookingListTable;
