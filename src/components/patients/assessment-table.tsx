"use client";

import { A_NUMBER_LABELS, Q_NUMBER_LABELS } from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";
import type { Measurement } from "@/types/api";

interface AssessmentTableProps {
  items: Measurement[];
  emptyMessage?: string;
}

export function AssessmentTable({
  items,
  emptyMessage = "موردی ثبت نشده",
}: AssessmentTableProps) {
  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="pb-3 pr-4 text-right font-medium">تاریخ</th>
            <th className="pb-3 pr-4 text-right font-medium">سؤال</th>
            <th className="pb-3 text-right font-medium">پاسخ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isRisk = item.q_number === 2 && item.a_number >= 3;
            return (
              <tr
                key={item.id}
                className={cn(
                  "border-b last:border-0",
                  isRisk && "bg-destructive/5"
                )}
              >
                <td className="py-3 pr-4 whitespace-nowrap">
                  {formatDateTime(item.date, item.time)}
                </td>
                <td className="py-3 pr-4">
                  {Q_NUMBER_LABELS[item.q_number] ?? item.q_number}
                </td>
                <td className="py-3">
                  <span
                    className={cn(
                      isRisk && "text-destructive font-medium"
                    )}
                  >
                    {A_NUMBER_LABELS[item.a_number] ?? item.a_number}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
