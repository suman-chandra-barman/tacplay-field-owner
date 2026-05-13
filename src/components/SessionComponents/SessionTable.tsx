/** @format */

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import CustomTable from "@/components/CommonComponents/CustomTable";
import Link from "next/link";
import SessionLoading from "@/components/SessionComponents/SessionLoading";
import {
  setSessionsLimit,
  setSessionsMatchType,
  setSessionsPage,
  setSessionsStatus,
} from "@/redux/features/sessions/sessionsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetOwnerSessionsQuery } from "@/redux/features/sessions/sessionsAPI";
import type {
  SessionMatchTypeFilter,
  SessionsListItem,
  SessionStatusFilter,
} from "@/types/SessionTypes";
import { useTranslation } from "react-i18next";

const SessionTable: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const columns = [
    {
      header: t("sessions.columns.sessionId"),
      accessor: "session_id" as keyof SessionsListItem,
    },
    {
      header: t("sessions.columns.date"),
      accessor: "date" as keyof SessionsListItem,
    },
    {
      header: t("sessions.columns.time"),
      accessor: "time" as keyof SessionsListItem,
    },
    {
      header: t("sessions.columns.matchType"),
      accessor: ((row: SessionsListItem) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              row.match_type.toLowerCase() === "ranked"
                ? "bg-custom-red"
                : "bg-custom-yellow"
            }`}
          />
          <span>{row.match_type_display}</span>
        </div>
      )) as (row: SessionsListItem) => React.ReactNode,
    },
    {
      header: t("sessions.columns.players"),
      accessor: "player" as keyof SessionsListItem,
    },
    {
      header: t("sessions.columns.booked"),
      accessor: "booked" as keyof SessionsListItem,
    },
    {
      header: t("sessions.columns.status"),
      accessor: "status_display" as keyof SessionsListItem,
    },
  ];

  const page = useAppSelector((state) => state.sessions.page);
  const limit = useAppSelector((state) => state.sessions.limit);
  const status = useAppSelector((state) => state.sessions.status);
  const matchType = useAppSelector((state) => state.sessions.matchType);

  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      status,
      match_type: matchType,
    }),
    [limit, matchType, page, status],
  );

  const { data, isLoading, isFetching, isError } =
    useGetOwnerSessionsQuery(queryArgs);

  const rows = data?.data ?? [];
  const totalPage = data?.meta.totalPage ?? 1;
  const totalCount = data?.meta.total ?? rows.length;

  if ((isLoading || isFetching) && !data) {
    return <SessionLoading />;
  }

  const handleViewSession = (row: SessionsListItem) => {
    router.push(`/sessions/${row.id}`);
  };

  return (
    <div className="w-full  space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          {t("sessions.title")}
        </h1>
      </div>

      {/* Search, Filter & Create */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={status}
            onChange={(event) =>
              dispatch(
                setSessionsStatus(event.target.value as SessionStatusFilter),
              )
            }
            className="bg-muted border border-white/10 rounded-lg px-4 py-2 text-sm text-primary outline-none"
          >
            <option value="all">{t("sessions.filters.allStatus")}</option>
            <option value="open">{t("sessions.filters.open")}</option>
            <option value="ongoing">{t("sessions.filters.ongoing")}</option>
            <option value="completed">{t("sessions.filters.completed")}</option>
            <option value="cancelled">{t("sessions.filters.cancelled")}</option>
          </select>

          <select
            value={matchType}
            onChange={(event) =>
              dispatch(
                setSessionsMatchType(
                  event.target.value as SessionMatchTypeFilter,
                ),
              )
            }
            className="bg-muted border border-white/10 rounded-lg px-4 py-2 text-sm text-primary outline-none"
          >
            <option value="all">{t("sessions.filters.allMatchTypes")}</option>
            <option value="ranked">{t("sessions.filters.ranked")}</option>
            <option value="social">{t("sessions.filters.social")}</option>
          </select>
        </div>

        {/* Create New Session */}
        <Link href="/sessions/create-session">
          <button className="flex cursor-pointer items-center gap-2 bg-custom-red hover:bg-custom-red/80 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            {t("sessions.createNew")}
          </button>
        </Link>
      </div>

      {isError ? (
        <div className="text-sm text-destructive">
          {t("sessions.loadFailed")}
        </div>
      ) : null}

      {/* Table */}
      <CustomTable<SessionsListItem>
        data={rows}
        columns={columns}
        onAction={handleViewSession}
        itemsPerPage={limit}
        serverPagination
        currentPage={page}
        totalPages={totalPage}
        additionalCount={totalCount}
        onPageChange={(nextPage) => dispatch(setSessionsPage(nextPage))}
        onItemsPerPageChange={(nextLimit) =>
          dispatch(setSessionsLimit(nextLimit))
        }
      />
    </div>
  );
};

export default SessionTable;
