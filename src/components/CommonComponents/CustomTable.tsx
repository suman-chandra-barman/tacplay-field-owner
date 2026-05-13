/** @format */
"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface CustomTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
  }[];
  onAction?: (row: T) => void;
  itemsPerPage?: number;
  serverPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  title?: string;
  additionalCount?: number;
}

const CustomTable = <T extends Record<string, unknown>>({
  data,
  columns,
  onAction,
  itemsPerPage = 10,
  serverPagination = false,
  currentPage: controlledCurrentPage,
  totalPages: controlledTotalPages,
  onPageChange,
  onItemsPerPageChange,
  additionalCount,
}: CustomTableProps<T>) => {
  const { t } = useTranslation("dashboard");
  const [internalPage, setInternalPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] =
    useState(itemsPerPage);

  useEffect(() => {
    setInternalItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  useEffect(() => {
    if (!serverPagination) {
      setInternalPage(1);
    }
  }, [data, serverPagination]);

  const currentPage = controlledCurrentPage ?? internalPage;
  const pageSize = serverPagination ? itemsPerPage : internalItemsPerPage;
  const totalPages = serverPagination
    ? (controlledTotalPages ?? 1)
    : Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = serverPagination
    ? data
    : data.slice(startIndex, startIndex + pageSize);
  const endIndex = startIndex + currentData.length;
  const totalEntries = serverPagination
    ? (additionalCount ?? data.length)
    : data.length;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "paid":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "ongoing":
        return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
      case "complete":
      case "completed":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "cancelled":
        return "bg-custom-red/20 text-red-400 border border-custom-red/30";
      case "pending":
        return "bg-custom-yellow/20 text-yellow-400 border border-custom-yellow/30";
      default:
        return "bg-secondary/20 text-secondary border border-secondary/30";
    }
  };

  const renderCell = (row: T, column: (typeof columns)[0]) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }

    const value = row[column.accessor as keyof T];

    if (column.header === "Status" && typeof value === "string") {
      return (
        <div
          className={cn(
            "w-24 px-2 py-1 flex justify-center items-center rounded-md text-xs font-medium",
            getStatusColor(value),
          )}
        >
          {value}
        </div>
      );
    }

    return value as React.ReactNode;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (serverPagination) {
        onPageChange?.(page);
      } else {
        setInternalPage(page);
        onPageChange?.(page);
      }
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4 overflow-x-auto">
      {/* Table Container */}
      <div className="rounded-xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <Table className="border-none min-w-full">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-white/5">
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={cn(
                      "font-medium text-secondary text-xs sm:text-sm py-3 sm:py-4 whitespace-nowrap",
                      column.className,
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
                {onAction && (
                  <TableHead className="font-medium text-secondary text-xs sm:text-sm text-right py-3 sm:py-4 whitespace-nowrap">
                    {t("common.action")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="border-b border-white/5 hover:bg-muted/30 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={cn(
                        "text-primary/80 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap",
                        column.className,
                      )}
                    >
                      {renderCell(row, column)}
                    </TableCell>
                  ))}
                  {onAction && (
                    <TableCell className="text-right py-3 sm:py-4">
                      <button
                        onClick={() => onAction(row)}
                        className="cursor-pointer p-1.5 sm:p-2 hover:bg-white/5 rounded-full transition-colors inline-flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-custom-yellow" />
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 gap-3 flex-wrap">
        <p className="text-xs text-secondary">
          {t("table.showing", {
            from: totalEntries === 0 ? 0 : startIndex + 1,
            to: Math.min(endIndex, totalEntries),
            total: totalEntries,
          })}
        </p>
        <div className="flex items-center gap-2">
          <Pagination>
            <PaginationContent className="flex-wrap gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={cn(
                    "text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4 text-secondary hover:text-primary",
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer",
                  )}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index} className="hidden sm:inline-flex">
                  {page === "..." ? (
                    <PaginationEllipsis className="h-8 sm:h-10 text-secondary" />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className={cn(
                        "cursor-pointer text-xs sm:text-sm h-8 sm:h-10 w-8 sm:w-10 text-secondary hover:text-primary",
                        currentPage === page &&
                          "bg-custom-red text-white hover:bg-custom-red/80 hover:text-white border-custom-red",
                      )}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem className="sm:hidden">
                <PaginationLink
                  isActive={true}
                  className="cursor-default bg-custom-red text-white h-8 w-8 text-xs border-custom-red"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={cn(
                    "text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4 text-secondary hover:text-primary",
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <select
            className="bg-muted border border-white/10 text-primary text-xs rounded-md px-2 py-1.5 outline-none"
            value={pageSize}
            onChange={(event) => {
              const nextItemsPerPage = Number(event.target.value);

              if (serverPagination) {
                onItemsPerPageChange?.(nextItemsPerPage);
              } else {
                setInternalItemsPerPage(nextItemsPerPage);
                setInternalPage(1);
                onItemsPerPageChange?.(nextItemsPerPage);
              }
            }}
          >
            <option value={10}>{t("common.show10")}</option>
            <option value={25}>{t("common.show25")}</option>
            <option value={50}>{t("common.show50")}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
