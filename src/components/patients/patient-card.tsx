"use client";

import Link from "next/link";
import { Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Patient } from "@/types/api";

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
    <Link href={`/dashboard/patients/${patient.id}`}>
      <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30 cursor-pointer border-primary/10 bg-gradient-to-br from-white to-teal-50/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-teal-100">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{patient.name}</p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <Phone className="h-3 w-3" />
                <span dir="ltr">{patient.phone}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ثبت: {formatDate(patient.created_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
