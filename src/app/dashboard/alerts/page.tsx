"use client";

import { useCallback } from "react";
import { AlertCard } from "@/components/alerts/alert-card";
import { DashboardHeader } from "@/components/layout/dashboard-sidebar";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { getAlerts } from "@/lib/api/alerts";
import { useAuthStore } from "@/stores/auth-store";

export default function AlertsPage() {
  const token = useAuthStore((s) => s.token);

  const fetchAlerts = useCallback(
    (page: number, perPage: number) => {
      if (!token) return Promise.reject();
      return getAlerts(token, { page, per_page: perPage });
    },
    [token]
  );

  const {
    items: alerts,
    meta,
    page,
    perPage,
    loading,
    error,
    setPage,
    setPerPage,
  } = usePaginatedList({
    fetchFn: fetchAlerts,
    enabled: !!token,
  });

  if (loading && !meta) {
    return <LoadingSpinner text="در حال بارگذاری هشدارها..." />;
  }
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <DashboardHeader
        title="هشدارهای ریسک"
        description="هشدارهای خودکار بر اساس ارزیابی تمایل به خودکشی"
      />

      {alerts.length === 0 ? (
        <EmptyState
          title="هشداری وجود ندارد"
          description="هشدارها زمانی ایجاد می‌شوند که بیمار تمایل به خودکشی بالا یا بحرانی گزارش کند"
        />
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>

          {meta && (
            <Pagination
              meta={meta}
              page={page}
              perPage={perPage}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
