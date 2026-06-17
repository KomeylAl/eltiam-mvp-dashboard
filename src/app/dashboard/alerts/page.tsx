"use client";

import { useEffect, useState } from "react";
import { AlertCard } from "@/components/alerts/alert-card";
import { DashboardHeader } from "@/components/layout/dashboard-sidebar";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { getAlerts } from "@/lib/api/alerts";
import { useAuthStore } from "@/stores/auth-store";
import type { RiskAlert } from "@/types/api";

export default function AlertsPage() {
  const token = useAuthStore((s) => s.token);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    getAlerts(token)
      .then((res) => setAlerts(res.data))
      .catch(() => setError("خطا در بارگذاری هشدارها"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <LoadingSpinner text="در حال بارگذاری هشدارها..." />;
  if (error) return <ErrorState message={error} />;

  const critical = alerts.filter((a) => a.risk_level === 4);
  const high = alerts.filter((a) => a.risk_level === 3);

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
        <div className="space-y-8">
          {critical.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-destructive mb-3">
                بحرانی ({critical.length.toLocaleString("fa-IR")})
              </h2>
              <div className="space-y-3">
                {critical.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </section>
          )}

          {high.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-amber-700 mb-3">
                بالا ({high.length.toLocaleString("fa-IR")})
              </h2>
              <div className="space-y-3">
                {high.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
