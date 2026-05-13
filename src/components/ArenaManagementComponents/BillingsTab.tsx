/** @format */

"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface BillingRecord {
  invoiceId: string;
  date: string;
  plan: string;
  price: string;
}

const sampleBillings: BillingRecord[] = Array.from({ length: 12 }, () => ({
  invoiceId: "#CH 565",
  date: "26 Jan 2026",
  plan: "Starter",
  price: "$265",
}));

const BillingsTab = () => {
  const [search, setSearch] = useState("");

  const filteredData = sampleBillings.filter(
    (b) =>
      b.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      b.plan.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">
          Billing History
        </h2>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-lg bg-input/30 border border-white/10 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-custom-yellow/50"
            />
          </div>
          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-input/30 text-sm text-primary hover:bg-input/50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-muted/30">
              <th className="p-3 text-left w-10">
                <Checkbox className="border-white/20" />
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 text-muted-foreground font-medium">
                  Invoice Id
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 text-muted-foreground font-medium">
                  Date
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 text-muted-foreground font-medium">
                  Plan
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex items-center gap-1 text-muted-foreground font-medium">
                  Price
                  <ArrowUpDown className="w-3 h-3" />
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
                <td className="p-3">
                  <Checkbox className="border-white/20" />
                </td>
                <td className="p-3 text-primary font-medium">
                  {item.invoiceId}
                </td>
                <td className="p-3 text-muted-foreground">{item.date}</td>
                <td className="p-3 text-muted-foreground">{item.plan}</td>
                <td className="p-3 text-primary font-medium">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="text-center py-10 text-muted-foreground text-sm">
          No billing records found.
        </div>
      )}
    </div>
  );
};

export default BillingsTab;
