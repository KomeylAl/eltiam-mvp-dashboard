"use client";

import { Trophy } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { WordGame } from "@/types/api";

interface WordGamesListProps {
  items: WordGame[];
}

export function WordGamesList({ items }: WordGamesListProps) {
  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        بازی کلمات ثبت نشده
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((game) => (
        <div
          key={game.id}
          className="flex items-center justify-between rounded-lg border px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
              <Trophy className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">{game.point.toLocaleString("fa-IR")} امتیاز</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(game.date, game.time)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
