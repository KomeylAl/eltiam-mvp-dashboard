"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Pencil, Phone, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { AssessmentTable } from "@/components/patients/assessment-table";
import { SafetyPlansList } from "@/components/patients/safety-plans-list";
import { SocialProblemsList } from "@/components/patients/social-problems-list";
import { WordGamesList } from "@/components/patients/word-games-list";
import { DashboardHeader } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import {
  deletePatient,
  getInterventions,
  getMeasurements,
  getPatient,
  getSafetyPlans,
  getSocialProblems,
  getWordGames,
} from "@/lib/api/patients";
import { useAuthStore } from "@/stores/auth-store";
import type {
  Intervention,
  Measurement,
  Patient,
  SafetyPlan,
  SocialProblem,
  WordGame,
} from "@/types/api";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const patientId = Number(params.id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [socialProblems, setSocialProblems] = useState<SocialProblem[]>([]);
  const [wordGames, setWordGames] = useState<WordGame[]>([]);
  const [safetyPlans, setSafetyPlans] = useState<SafetyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token || !patientId) return;

    async function load() {
      try {
        const [
          patientRes,
          measurementsRes,
          interventionsRes,
          socialRes,
          gamesRes,
          plansRes,
        ] = await Promise.all([
          getPatient(token!, patientId),
          getMeasurements(token!, patientId),
          getInterventions(token!, patientId),
          getSocialProblems(token!, patientId),
          getWordGames(token!, patientId),
          getSafetyPlans(token!, patientId),
        ]);

        setPatient(patientRes.data);
        setMeasurements(measurementsRes.data);
        setInterventions(interventionsRes.data);
        setSocialProblems(socialRes.data);
        setWordGames(gamesRes.data);
        setSafetyPlans(plansRes.data);
      } catch {
        setError("بیمار یافت نشد یا دسترسی ندارید");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token, patientId]);

  const handleDelete = async () => {
    if (!token || !patient) return;
    setDeleting(true);
    try {
      await deletePatient(token, patient.id);
      toast.success("بیمار حذف شد");
      router.push("/dashboard/patients");
    } catch {
      toast.error("خطا در حذف بیمار");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) return <LoadingSpinner text="در حال بارگذاری..." />;
  if (error || !patient) return <ErrorState message={error ?? "بیمار یافت نشد"} />;

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/dashboard/patients">
          <ArrowRight className="h-4 w-4" />
          بازگشت به لیست
        </Link>
      </Button>

      <DashboardHeader
        title={patient.name}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/patients/${patient.id}/edit`}>
                <Pencil className="h-4 w-4" />
                ویرایش
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-medium text-lg">{patient.name}</p>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
              <Phone className="h-4 w-4" />
              <span dir="ltr">{patient.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs dir="rtl" defaultValue="measurements">
        <TabsList>
          <TabsTrigger value="measurements">
            ارزیابی ({measurements.length.toLocaleString("fa-IR")})
          </TabsTrigger>
          <TabsTrigger value="interventions">
            مداخله ({interventions.length.toLocaleString("fa-IR")})
          </TabsTrigger>
          <TabsTrigger value="social">
            مشکلات ({socialProblems.length.toLocaleString("fa-IR")})
          </TabsTrigger>
          <TabsTrigger value="games">
            بازی ({wordGames.length.toLocaleString("fa-IR")})
          </TabsTrigger>
          <TabsTrigger value="safety">
            ایمنی ({safetyPlans.length.toLocaleString("fa-IR")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="measurements">
          <Card>
            <CardContent className="p-4">
              <AssessmentTable items={measurements} emptyMessage="ارزیابی ثبت نشده" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions">
          <Card>
            <CardContent className="p-4">
              <AssessmentTable
                items={interventions}
                emptyMessage="مداخله‌ای ثبت نشده"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <SocialProblemsList items={socialProblems} />
        </TabsContent>

        <TabsContent value="games">
          <Card>
            <CardContent className="p-4">
              <WordGamesList items={wordGames} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety">
          <SafetyPlansList items={safetyPlans} />
        </TabsContent>
      </Tabs>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف بیمار</DialogTitle>
            <DialogDescription>
              آیا از حذف «{patient.name}» مطمئن هستید؟ تمام سوابق این بیمار نیز
              حذف خواهد شد.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "در حال حذف..." : "حذف"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
