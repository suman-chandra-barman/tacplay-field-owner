/** @format */

"use client";

import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useGetFieldOwnerBillingHistoryQuery } from "@/redux/features/subscriptions/subscriptionsAPI";
import type { BillingHistoryItem } from "@/types/SubscriptionTypes";
import { useTranslation } from "react-i18next";
import { getPlanDisplayName } from "@/lib/utils";

const statusBadgeClassMap: Record<string, string> = {
  paid: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
  pending: "bg-custom-yellow/20 text-yellow-400 border border-custom-yellow/30",
  failed: "bg-custom-red/20 text-red-400 border border-custom-red/30",
  refunded: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
};

const BillingsTab = () => {
  const { t } = useTranslation("dashboard");
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, isError } =
    useGetFieldOwnerBillingHistoryQuery();

  const billings = useMemo(() => data?.data ?? [], [data]);

  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return billings;
    }

    return billings.filter((billing) =>
      [
        billing.invoice_id,
        billing.date,
        billing.plan,
        billing.price,
        billing.currency,
        billing.payment_status,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [billings, search]);

  const formatPrice = (billing: BillingHistoryItem) =>
    `${billing.currency} ${billing.price}`;

  const statusBadge = (status: string) => {
    const colors =
      statusBadgeClassMap[status.toLowerCase()] ??
      "bg-secondary/20 text-secondary border border-secondary/30";

    const normalizedStatus = status.toLowerCase();
    const statusKey = `status${normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}`;
    const translatedStatus = t(`arena.billingsTab.${statusKey}`, { defaultValue: status });

    return (
      <span
        className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-md capitalize ${colors}`}
      >
        {translatedStatus}
      </span>
    );
  };

  if (isLoading || isFetching) {
    return (
      <div className="py-10 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        {t("arena.billingsTab.loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-sm text-destructive">
        {t("arena.billingsTab.loadFailed")}
      </div>
    );
  }

  if (billings.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {t("arena.billingsTab.title")}
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("common.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-lg bg-input/30 border border-white/10 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-custom-yellow/50"
              />
            </div>
          </div>
        </div>

        <div className="text-center py-10 text-muted-foreground text-sm">
          {t("arena.billingsTab.noRecords")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">
          {t("arena.billingsTab.title")}
        </h2>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("common.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-lg bg-input/30 border border-white/10 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-custom-yellow/50"
            />
          </div>
  
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-muted/30">
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 text-muted-foreground font-medium">
                  {t("arena.billingsTab.invoiceId")}
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 text-muted-foreground font-medium">
                  {t("arena.billingsTab.date")}
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 text-muted-foreground font-medium">
                  {t("arena.billingsTab.plan")}
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 text-muted-foreground font-medium">
                  {t("arena.billingsTab.price")}
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 text-muted-foreground font-medium">
                  {t("arena.billingsTab.status")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-white/5 hover:bg-muted/20 transition-colors"
              >
                <td className="p-3 text-primary font-medium">
                  {item.invoice_id}
                </td>
                <td className="p-3 text-muted-foreground">{item.date}</td>
                <td className="p-3 text-muted-foreground">{getPlanDisplayName(item.plan, t)}</td>
                <td className="p-3 text-primary font-medium">
                  {formatPrice(item)}
                </td>
                <td className="p-3 text-primary font-medium">
                  {statusBadge(item.payment_status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredData.length === 0 && (
        <div className="text-center py-10 text-muted-foreground text-sm">
          {t("arena.billingsTab.noRecords")}
        </div>
      )}
    </div>
  );
};

export default BillingsTab;
