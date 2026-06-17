"use client";

import { formatDateTime } from "@/lib/utils";
import type { SocialProblem } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SocialProblemsListProps {
  items: SocialProblem[];
}

export function SocialProblemsList({ items }: SocialProblemsListProps) {
  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        مشکل اجتماعی ثبت نشده
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{item.problem}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(item.date, item.time)}
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Field label="دلیل" value={item.reason} />
            <Field label="راه‌حل‌ها" value={item.solutions} />
            <Field label="ارزیابی" value={item.evaluations} />
            <Field label="برنامه" value={item.plan} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
      <p>{value}</p>
    </div>
  );
}
