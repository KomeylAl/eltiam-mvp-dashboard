"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { PaginatedResponse, PaginationMeta } from "@/types/api";

interface UsePaginatedListOptions<T> {
  fetchFn: (page: number, perPage: number) => Promise<PaginatedResponse<T>>;
  enabled?: boolean;
  initialPerPage?: number;
}

export function usePaginatedList<T>({
  fetchFn,
  enabled = true,
  initialPerPage = DEFAULT_PAGE_SIZE,
}: UsePaginatedListOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchFn(page, perPage);
      setItems(response.data);
      setMeta(response.meta);
    } catch {
      setError("خطا در بارگذاری");
      setItems([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, perPage, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  return {
    items,
    meta,
    page,
    perPage,
    loading,
    error,
    setPage: handlePageChange,
    setPerPage: handlePerPageChange,
    reload: load,
  };
}
