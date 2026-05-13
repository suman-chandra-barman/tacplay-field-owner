/** @format */

"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import CustomTable from "../CommonComponents/CustomTable";
import TransactionDetailsSheet from "./TransactionDetailsSheet";
import EarningLoading from "./EarningLoading";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setEarningsLimit,
  setEarningsPage,
} from "@/redux/features/earnings/earningsSlice";
import { useGetEarningsListQuery } from "@/redux/features/earnings/earningsAPI";
import type { EarningsListItem } from "@/types/EarningTypes";
import { useTranslation } from "react-i18next";

const EarningTable = () => {
  const { t } = useTranslation("dashboard");
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.earnings.page);
  const limit = useAppSelector((state) => state.earnings.limit);

  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      search: search.trim() || undefined,
    }),
    [limit, page, search],
  );

  const { data, isLoading, isFetching, isError } =
    useGetEarningsListQuery(queryArgs);

  const rows = data?.data ?? [];
  const totalPage = data?.meta.totalPage ?? 1;
  const totalCount = data?.meta.total ?? rows.length;

  if ((isLoading || isFetching) && !data) {
    return <EarningLoading />;
  }

  const serviceTypeDot = (type: string) => {
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

  const paymentBadge = (method: string) => {
    const isStripe = method.toLowerCase() === "stripe";
    return (
      <span
        className={`px-2.5 py-0.5 text-xs font-medium rounded-md border ${
          isStripe
            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
        }`}
      >
        {method}
      </span>
    );
  };

  const columns = [
    {
      header: t("earnings.columns.transactionId"),
      accessor: "display_transaction_id" as keyof EarningsListItem,
    },
    {
      header: t("earnings.columns.playerName"),
      accessor: "user_name" as keyof EarningsListItem,
    },
    {
      header: t("earnings.columns.sessionId"),
      accessor: "display_session_id" as keyof EarningsListItem,
    },
    {
      header: t("earnings.columns.matchType"),
      accessor: (row: EarningsListItem) =>
        serviceTypeDot(row.session_type_display),
    },
    {
      header: t("earnings.columns.date"),
      accessor: "date_display" as keyof EarningsListItem,
    },
    {
      header: t("earnings.columns.amount"),
      accessor: "amount_display" as keyof EarningsListItem,
    },
    {
      header: t("earnings.columns.paymentMethod"),
      accessor: (row: EarningsListItem) =>
        paymentBadge(row.payment_method_display),
    },
  ];

  const handleAction = (row: EarningsListItem) => {
    setSelectedTransactionId(row.transaction_id);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {t("earnings.title")}
        </h1>
        <p className="text-sm text-secondary mt-1">{t("earnings.subtitle")}</p>
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
              dispatch(setEarningsPage(1));
            }}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-white/10 text-sm text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-custom-yellow/50"
          />
        </div>
      </div>

      {isError ? (
        <div className="text-sm text-destructive">
          {t("earnings.loadFailed")}
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
        onPageChange={(nextPage) => dispatch(setEarningsPage(nextPage))}
        onItemsPerPageChange={(nextLimit) =>
          dispatch(setEarningsLimit(nextLimit))
        }
      />

      <TransactionDetailsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        transactionId={selectedTransactionId}
      />
    </div>
  );
};

export default EarningTable;
