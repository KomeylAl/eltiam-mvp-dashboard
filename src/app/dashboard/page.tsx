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
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import type { Patient, RiskAlert } from "@/types/api";

export default function DashboardPage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [patientTotal, setPatientTotal] = useState(0);
  const [alertTotal, setAlertTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const [patientsRes, alertsRes] = await Promise.all([
          getPatients(token!, { page: 1, per_page: 5 }),
          getAlerts(token!, { page: 1, per_page: 5 }),
        ]);
        setPatients(patientsRes.data);
        setAlerts(alertsRes.data);
        setPatientTotal(patientsRes.meta.total);
        setAlertTotal(alertsRes.meta.total);
      } catch {
        setError("خطا در بارگذاری اطلاعات");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  const unreviewedAlerts = alerts.filter((a) => !a.reviewed_at);
  const criticalCount = alerts.filter(
    (a) => a.risk_level === 4 && !a.reviewed_at
  ).length;

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
          value={patientTotal.toLocaleString("fa-IR")}
          href="/dashboard/patients"
          gradient="from-teal-500/10 via-primary/5 to-emerald-50"
          iconColor="text-primary"
        />
        <StatCard
          icon={AlertTriangle}
          label="هشدارهای فعال"
          value={alertTotal.toLocaleString("fa-IR")}
          href="/dashboard/alerts"
          highlight={alertTotal > 0}
          gradient="from-amber-500/10 via-amber-50/50 to-orange-50"
          iconColor="text-amber-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="هشدار بحرانی"
          value={criticalCount.toLocaleString("fa-IR")}
          href="/dashboard/alerts"
          highlight={criticalCount > 0}
          destructive
          gradient="from-red-500/10 via-destructive/5 to-rose-50"
          iconColor="text-destructive"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white via-white to-teal-50/40 p-5 shadow-sm">
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
              {unreviewedAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} compact />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-primary/10 bg-gradient-to-br from-white via-white to-emerald-50/40 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">بیماران</h2>
            <Button size="sm" asChild className="bg-gradient-to-l from-primary to-teal-600">
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
              {patients.map((patient) => (
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
  gradient,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  highlight?: boolean;
  destructive?: boolean;
  gradient: string;
  iconColor: string;
}) {
  return (
    <Link href={href}>
      <Card
        className={cn(
          "transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer overflow-hidden border-primary/10 bg-gradient-to-br",
          gradient,
          highlight && destructive && "border-destructive/30",
          highlight && !destructive && "border-amber-200/60"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              destructive && highlight
                ? "bg-destructive/10"
                : highlight
                  ? "bg-amber-100"
                  : "bg-primary/10"
            )}
          >
            <Icon className={cn("h-4 w-4", iconColor)} />
          </div>
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              "text-3xl font-bold",
              destructive && highlight && "text-destructive",
              highlight && !destructive && "text-amber-700"
            )}
          >
            {value}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
