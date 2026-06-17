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
      <Card className="transition-all hover:shadow-md hover:border-primary/20 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
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
