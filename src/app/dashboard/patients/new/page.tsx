"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PatientForm } from "@/components/patients/patient-form";
import { DashboardHeader } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createPatient } from "@/lib/api/patients";
import { useAuthStore } from "@/stores/auth-store";
import type { CreatePatientPayload } from "@/types/api";

export default function NewPatientPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const handleSubmit = async (data: CreatePatientPayload) => {
    if (!token) return;
    await createPatient(token, data as CreatePatientPayload);
    toast.success("بیمار با موفقیت ثبت شد");
    router.push("/dashboard/patients");
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/patients">
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Link>
        </Button>
        <DashboardHeader
          title="افزودن بیمار"
          description="پس از ثبت، شماره موبایل و رمز عبور را با بیمار به اشتراک بگذارید"
        />
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>اطلاعات بیمار</CardTitle>
          <CardDescription>
            بیمار با این اطلاعات می‌تواند در اپ موبایل وارد شود
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientForm
            submitLabel="ثبت بیمار"
            onSubmit={handleSubmit}
            requirePassword
          />
        </CardContent>
      </Card>
    </div>
  );
}
