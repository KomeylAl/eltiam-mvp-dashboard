"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types/api";

interface PaginationProps {
  meta: PaginationMeta;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  className?: string;
}

function getPageNumbers(current: number, last: number): (number | "ellipsis")[] {
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < last - 2) pages.push("ellipsis");

  pages.push(last);
  return pages;
}

export function Pagination({
  meta,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  className,
}: PaginationProps) {
  if (meta.total === 0) return null;

  const pages = getPageNumbers(page, meta.last_page);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-primary/10 bg-gradient-to-l from-primary/5 via-card to-teal-50/30 px-4 py-3",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        نمایش{" "}
        <span className="font-medium text-foreground">
          {meta.from?.toLocaleString("fa-IR") ?? 0}
        </span>
        {" "}تا{" "}
        <span className="font-medium text-foreground">
          {meta.to?.toLocaleString("fa-IR") ?? 0}
        </span>
        {" "}از{" "}
        <span className="font-medium text-foreground">
          {meta.total.toLocaleString("fa-IR")}
        </span>
        {" "}مورد
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {onPerPageChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="per-page" className="text-sm text-muted-foreground">
              در هر صفحه
            </label>
            <select
              id="per-page"
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="h-9 rounded-lg border border-primary/20 bg-white/80 px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size.toLocaleString("fa-IR")}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-primary/20 bg-white/80 hover:bg-primary/10"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="صفحه قبل"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {pages.map((p, i) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground">
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-9 w-9",
                  p === page
                    ? "bg-gradient-to-br from-primary to-teal-600 shadow-md"
                    : "border-primary/20 bg-white/80 hover:bg-primary/10"
                )}
                onClick={() => onPageChange(p)}
                aria-label={`صفحه ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p.toLocaleString("fa-IR")}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-primary/20 bg-white/80 hover:bg-primary/10"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= meta.last_page}
            aria-label="صفحه بعد"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
