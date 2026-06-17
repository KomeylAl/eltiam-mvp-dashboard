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
        "flex flex-col items-center justify-center gap-2 py-12 text-center",
        className
      )}
    >
      <Inbox className="h-10 w-10 text-muted-foreground/50" />
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
