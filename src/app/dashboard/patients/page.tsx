"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PatientCard } from "@/components/patients/patient-card";
import { DashboardHeader } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Pagination } from "@/components/shared/pagination";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { getPatients } from "@/lib/api/patients";
import { useAuthStore } from "@/stores/auth-store";

export default function PatientsPage() {
  const token = useAuthStore((s) => s.token);

  const fetchPatients = useCallback(
    (page: number, perPage: number) => {
      if (!token) return Promise.reject();
      return getPatients(token, { page, per_page: perPage });
    },
    [token]
  );

  const {
    items: patients,
    meta,
    page,
    perPage,
    loading,
    error,
    setPage,
    setPerPage,
  } = usePaginatedList({
    fetchFn: fetchPatients,
    enabled: !!token,
  });

  if (loading && !meta) {
    return <LoadingSpinner text="در حال بارگذاری بیماران..." />;
  }
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <DashboardHeader
        title="بیماران"
        description="مدیریت و مشاهده اطلاعات بیماران"
        action={
          <Button asChild className="bg-gradient-to-l from-primary to-teal-600 shadow-md hover:shadow-lg">
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
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
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
