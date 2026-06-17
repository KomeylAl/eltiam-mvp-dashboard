"use client";

import { formatDateTime } from "@/lib/utils";
import type { SafetyPlan } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SafetyPlansListProps {
  items: SafetyPlan[];
}

const FIELDS: { key: keyof SafetyPlan; label: string }[] = [
  { key: "question_one", label: "چه چیزی پریشانی من را تحریک می‌کند؟" },
  { key: "question_two", label: "علائم هشداردهنده چیست؟" },
  { key: "thinking_feelings", label: "افکار و احساسات" },
  { key: "self_help", label: "کمک به خود" },
  { key: "others_help", label: "کمک دیگران" },
  { key: "close_people_list", label: "افراد نزدیک" },
  { key: "close_friends_thoughts", label: "افکار دوستان نزدیک" },
  { key: "phone_calls", label: "تماس‌های تلفنی" },
  { key: "protected_places", label: "مکان‌های امن" },
];

export function SafetyPlansList({ items }: SafetyPlansListProps) {
  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        برنامه ایمنی ثبت نشده
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((plan) => (
        <Card key={plan.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">برنامه ایمنی</CardTitle>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(plan.date, plan.time)}
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {FIELDS.map(({ key, label }) => (
              <div key={key}>
                <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
                <p>{plan[key] as string}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
