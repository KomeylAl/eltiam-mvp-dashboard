"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PatientForm } from "@/components/patients/patient-form";
import { DashboardHeader } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { getPatient, updatePatient } from "@/lib/api/patients";
import { useAuthStore } from "@/stores/auth-store";
import type { Patient, UpdatePatientPayload } from "@/types/api";

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const patientId = Number(params.id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !patientId) return;

    getPatient(token, patientId)
      .then((res) => setPatient(res.data))
      .catch(() => setError("بیمار یافت نشد"))
      .finally(() => setLoading(false));
  }, [token, patientId]);

  const handleSubmit = async (data: UpdatePatientPayload) => {
    if (!token || !patient) return;
    await updatePatient(token, patient.id, data);
    toast.success("اطلاعات بیمار به‌روزرسانی شد");
    router.push(`/dashboard/patients/${patient.id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error || !patient) return <ErrorState message={error ?? "بیمار یافت نشد"} />;

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/dashboard/patients/${patient.id}`}>
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </Link>
      </Button>

      <DashboardHeader title="ویرایش بیمار" description={patient.name} />

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>اطلاعات بیمار</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm
            initialValues={{ name: patient.name, phone: patient.phone }}
            submitLabel="ذخیره تغییرات"
            onSubmit={handleSubmit}
            requirePassword={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
