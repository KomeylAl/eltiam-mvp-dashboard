"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PatientCard } from "@/components/patients/patient-card";
import { DashboardHeader } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { getPatients } from "@/lib/api/patients";
import { useAuthStore } from "@/stores/auth-store";
import type { Patient } from "@/types/api";

export default function PatientsPage() {
  const token = useAuthStore((s) => s.token);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    getPatients(token)
      .then((res) => setPatients(res.data))
      .catch(() => setError("خطا در بارگذاری بیماران"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <LoadingSpinner text="در حال بارگذاری بیماران..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <DashboardHeader
        title="بیماران"
        description="مدیریت و مشاهده اطلاعات بیماران"
        action={
          <Button asChild>
            <Link href="/dashboard/patients/new">
              <Plus className="h-4 w-4" />
              بیمار جدید
            </Link>
          </Button>
        }
      />

      {patients.length === 0 ? (
        <EmptyState
          title="بیماری ثبت نشده"
          description="با افزودن بیمار، اطلاعات ورود اپ موبایل را به او بدهید"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
}
