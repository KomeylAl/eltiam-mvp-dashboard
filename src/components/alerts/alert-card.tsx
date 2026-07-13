"use client";

import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  RISK_LEVEL_LABELS,
  SOURCE_TYPE_LABELS,
} from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";
import type { RiskAlert } from "@/types/api";

interface AlertCardProps {
  alert: RiskAlert;
  compact?: boolean;
}

export function AlertCard({ alert, compact }: AlertCardProps) {
  const isCritical = alert.risk_level === 4;

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-lg hover:-translate-y-0.5 border-primary/10",
        isCritical
          ? "border-destructive/30 bg-gradient-to-l from-destructive/5 to-rose-50/50"
          : "bg-gradient-to-l from-amber-50/50 to-orange-50/30 border-amber-200/40"
      )}
    >
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                isCritical ? "bg-destructive/10" : "bg-amber-100"
              )}
            >
              <AlertTriangle
                className={cn(
                  "h-4 w-4",
                  isCritical ? "text-destructive" : "text-amber-600"
                )}
              />
            </div>
            <div className="min-w-0">
              <Link
                href={`/dashboard/patients/${alert.patient.id}`}
                className="font-medium hover:text-primary transition-colors"
              >
                {alert.patient.name}
              </Link>
              <p className="text-sm text-muted-foreground mt-0.5">
                {SOURCE_TYPE_LABELS[alert.source_type] ?? alert.source_type}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDateTime(
                  alert.created_at.split("T")[0],
                  alert.created_at.split("T")[1]?.slice(0, 5)
                )}
              </div>
            </div>
          </div>
          <Badge variant={isCritical ? "destructive" : "warning"}>
            {RISK_LEVEL_LABELS[alert.risk_level]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
