"use client";

import { AlertCircle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center rounded-2xl border border-dashed border-primary/20 bg-gradient-to-br from-white to-teal-50/30",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Inbox className="h-7 w-7 text-primary/60" />
      </div>
      <p className="font-medium text-muted-foreground">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground/80 max-w-sm">{description}</p>
      )}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  className?: string;
}

export function ErrorState({ message, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-12 text-center",
        className
      )}
    >
      <AlertCircle className="h-10 w-10 text-destructive/70" />
      <p className="font-medium text-destructive">{message}</p>
    </div>
  );
}
