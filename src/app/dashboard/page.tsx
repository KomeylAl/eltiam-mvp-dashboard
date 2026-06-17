"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Plus, Users } from "lucide-react";
import { AlertCard } from "@/components/alerts/alert-card";
import { PatientCard } from "@/components/patients/patient-card";
import { DashboardHeader } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { getAlerts } from "@/lib/api/alerts";
import { getPatients } from "@/lib/api/patients";
import { useAuthStore } from "@/stores/auth-store";
import type { Patient, RiskAlert } from "@/types/api";

export default function DashboardPage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const [patientsRes, alertsRes] = await Promise.all([
          getPatients(token!),
          getAlerts(token!),
        ]);
        setPatients(patientsRes.data);
        setAlerts(alertsRes.data);
      } catch {
        setError("خطا در بارگذاری اطلاعات");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  const unreviewedAlerts = alerts.filter((a) => !a.reviewed_at);
  const criticalCount = unreviewedAlerts.filter((a) => a.risk_level === 4).length;

  if (loading) return <LoadingSpinner text="در حال بارگذاری داشبورد..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <DashboardHeader
        title={`سلام، ${user?.name?.split(" ")[0] ?? "تراپیست"} 👋`}
        description="خلاصه وضعیت بیماران و هشدارهای ریسک"
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard
          icon={Users}
          label="تعداد بیماران"
          value={patients.length.toLocaleString("fa-IR")}
          href="/dashboard/patients"
        />
        <StatCard
          icon={AlertTriangle}
          label="هشدارهای فعال"
          value={unreviewedAlerts.length.toLocaleString("fa-IR")}
          href="/dashboard/alerts"
          highlight={unreviewedAlerts.length > 0}
        />
        <StatCard
          icon={AlertTriangle}
          label="هشدار بحرانی"
          value={criticalCount.toLocaleString("fa-IR")}
          href="/dashboard/alerts"
          highlight={criticalCount > 0}
          destructive
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">هشدارهای اخیر</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/alerts">مشاهده همه</Link>
            </Button>
          </div>
          {unreviewedAlerts.length === 0 ? (
            <EmptyState
              title="هشداری وجود ندارد"
              description="همه بیماران در وضعیت پایدار هستند"
            />
          ) : (
            <div className="space-y-3">
              {unreviewedAlerts.slice(0, 5).map((alert) => (
                <AlertCard key={alert.id} alert={alert} compact />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">بیماران</h2>
            <Button size="sm" asChild>
              <Link href="/dashboard/patients/new">
                <Plus className="h-4 w-4" />
                بیمار جدید
              </Link>
            </Button>
          </div>
          {patients.length === 0 ? (
            <EmptyState
              title="بیماری ثبت نشده"
              description="اولین بیمار خود را اضافه کنید"
            />
          ) : (
            <div className="space-y-3">
              {patients.slice(0, 5).map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  highlight,
  destructive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  highlight?: boolean;
  destructive?: boolean;
}) {
  return (
    <Link href={href}>
      <Card
        className={`transition-all hover:shadow-md cursor-pointer ${
          highlight
            ? destructive
              ? "border-destructive/30 bg-destructive/5"
              : "border-amber-200 bg-amber-50/50"
            : ""
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <Icon
            className={`h-4 w-4 ${
              destructive && highlight
                ? "text-destructive"
                : highlight
                  ? "text-amber-600"
                  : "text-muted-foreground"
            }`}
          />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
