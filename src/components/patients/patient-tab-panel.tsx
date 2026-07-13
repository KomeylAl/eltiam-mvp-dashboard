"use client";

import { useEffect, type ReactNode } from "react";
import { ErrorState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import type { PaginatedResponse } from "@/types/api";

interface PatientTabPanelProps<T> {
  active: boolean;
  fetchFn: (
    page: number,
    perPage: number
  ) => Promise<PaginatedResponse<T>>;
  render: (items: T[]) => ReactNode;
  onTotalChange?: (total: number) => void;
  wrapInCard?: boolean;
}

export function PatientTabPanel<T>({
  active,
  fetchFn,
  render,
  onTotalChange,
  wrapInCard = true,
}: PatientTabPanelProps<T>) {
  const {
    items,
    meta,
    page,
    perPage,
    loading,
    error,
    setPage,
    setPerPage,
  } = usePaginatedList({
    fetchFn,
    enabled: active,
  });

  useEffect(() => {
    if (meta && onTotalChange) {
      onTotalChange(meta.total);
    }
  }, [meta, onTotalChange]);

  if (!active) return null;

  if (loading && !meta) {
    return <LoadingSpinner text="در حال بارگذاری..." />;
  }

  if (error) return <ErrorState message={error} />;

  const content = (
    <div className="space-y-4">
      {render(items)}
      {meta && meta.total > 0 && (
        <Pagination
          meta={meta}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      )}
    </div>
  );

  if (!wrapInCard) return content;

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-white to-teal-50/20">
      <CardContent className="p-4">{content}</CardContent>
    </Card>
  );
}
