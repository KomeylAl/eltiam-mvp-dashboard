"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Pencil, Phone, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { AssessmentTable } from "@/components/patients/assessment-table";
import { PatientTabPanel } from "@/components/patients/patient-tab-panel";
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
import type { Patient } from "@/types/api";

type TabKey = "measurements" | "interventions" | "social" | "games" | "safety";

interface TabTotals {
  measurements: number | null;
  interventions: number | null;
  social: number | null;
  games: number | null;
  safety: number | null;
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const patientId = Number(params.id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("measurements");
  const [tabTotals, setTabTotals] = useState<TabTotals>({
    measurements: null,
    interventions: null,
    social: null,
    games: null,
    safety: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token || !patientId) return;

    getPatient(token, patientId)
      .then((res) => setPatient(res.data))
      .catch(() => setError("بیمار یافت نشد یا دسترسی ندارید"))
      .finally(() => setLoading(false));
  }, [token, patientId]);

  const fetchMeasurements = useCallback(
    (page: number, perPage: number) => {
      if (!token) return Promise.reject();
      return getMeasurements(token, patientId, { page, per_page: perPage });
    },
    [token, patientId]
  );

  const fetchInterventions = useCallback(
    (page: number, perPage: number) => {
      if (!token) return Promise.reject();
      return getInterventions(token, patientId, { page, per_page: perPage });
    },
    [token, patientId]
  );

  const fetchSocialProblems = useCallback(
    (page: number, perPage: number) => {
      if (!token) return Promise.reject();
      return getSocialProblems(token, patientId, { page, per_page: perPage });
    },
    [token, patientId]
  );

  const fetchWordGames = useCallback(
    (page: number, perPage: number) => {
      if (!token) return Promise.reject();
      return getWordGames(token, patientId, { page, per_page: perPage });
    },
    [token, patientId]
  );

  const fetchSafetyPlans = useCallback(
    (page: number, perPage: number) => {
      if (!token) return Promise.reject();
      return getSafetyPlans(token, patientId, { page, per_page: perPage });
    },
    [token, patientId]
  );

  const updateTabTotal = useCallback((key: TabKey, total: number) => {
    setTabTotals((prev) =>
      prev[key] === total ? prev : { ...prev, [key]: total }
    );
  }, []);

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

  const formatTabLabel = (label: string, total: number | null) =>
    total !== null ? `${label} (${total.toLocaleString("fa-IR")})` : label;

  if (loading) return <LoadingSpinner text="در حال بارگذاری..." />;
  if (error || !patient) return <ErrorState message={error ?? "بیمار یافت نشد"} />;

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4 hover:bg-primary/10">
        <Link href="/dashboard/patients">
          <ArrowRight className="h-4 w-4" />
          بازگشت به لیست
        </Link>
      </Button>

      <DashboardHeader
        title={patient.name}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="border-primary/20">
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

      <Card className="mb-6 border-primary/10 bg-gradient-to-l from-primary/5 via-white to-teal-50/50 shadow-sm">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-teal-100 shadow-inner">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-xl">{patient.name}</p>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
              <Phone className="h-4 w-4" />
              <span dir="ltr">{patient.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        dir="rtl"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabKey)}
      >
        <TabsList className="mb-4 h-auto flex-wrap gap-1 bg-gradient-to-l from-muted/80 to-teal-50/50 p-1">
          <TabsTrigger
            value="measurements"
            className="data-[state=active]:bg-gradient-to-l data-[state=active]:from-primary data-[state=active]:to-teal-600 data-[state=active]:text-white"
          >
            {formatTabLabel("ارزیابی", tabTotals.measurements)}
          </TabsTrigger>
          <TabsTrigger
            value="interventions"
            className="data-[state=active]:bg-gradient-to-l data-[state=active]:from-primary data-[state=active]:to-teal-600 data-[state=active]:text-white"
          >
            {formatTabLabel("مداخله", tabTotals.interventions)}
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="data-[state=active]:bg-gradient-to-l data-[state=active]:from-primary data-[state=active]:to-teal-600 data-[state=active]:text-white"
          >
            {formatTabLabel("مشکلات", tabTotals.social)}
          </TabsTrigger>
          <TabsTrigger
            value="games"
            className="data-[state=active]:bg-gradient-to-l data-[state=active]:from-primary data-[state=active]:to-teal-600 data-[state=active]:text-white"
          >
            {formatTabLabel("بازی", tabTotals.games)}
          </TabsTrigger>
          <TabsTrigger
            value="safety"
            className="data-[state=active]:bg-gradient-to-l data-[state=active]:from-primary data-[state=active]:to-teal-600 data-[state=active]:text-white"
          >
            {formatTabLabel("ایمنی", tabTotals.safety)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="measurements">
          <PatientTabPanel
            active={activeTab === "measurements"}
            fetchFn={fetchMeasurements}
            onTotalChange={(total) => updateTabTotal("measurements", total)}
            render={(items) => (
              <AssessmentTable items={items} emptyMessage="ارزیابی ثبت نشده" />
            )}
          />
        </TabsContent>

        <TabsContent value="interventions">
          <PatientTabPanel
            active={activeTab === "interventions"}
            fetchFn={fetchInterventions}
            onTotalChange={(total) => updateTabTotal("interventions", total)}
            render={(items) => (
              <AssessmentTable
                items={items}
                emptyMessage="مداخله‌ای ثبت نشده"
              />
            )}
          />
        </TabsContent>

        <TabsContent value="social">
          <PatientTabPanel
            active={activeTab === "social"}
            fetchFn={fetchSocialProblems}
            onTotalChange={(total) => updateTabTotal("social", total)}
            wrapInCard={false}
            render={(items) => <SocialProblemsList items={items} />}
          />
        </TabsContent>

        <TabsContent value="games">
          <PatientTabPanel
            active={activeTab === "games"}
            fetchFn={fetchWordGames}
            onTotalChange={(total) => updateTabTotal("games", total)}
            render={(items) => <WordGamesList items={items} />}
          />
        </TabsContent>

        <TabsContent value="safety">
          <PatientTabPanel
            active={activeTab === "safety"}
            fetchFn={fetchSafetyPlans}
            onTotalChange={(total) => updateTabTotal("safety", total)}
            wrapInCard={false}
            render={(items) => <SafetyPlansList items={items} />}
          />
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
