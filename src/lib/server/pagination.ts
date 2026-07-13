import type { NextRequest } from "next/server";

export function getPerPage(request: NextRequest): number {
  const raw = Number(request.nextUrl.searchParams.get("per_page") ?? "15");

  if (!Number.isFinite(raw) || raw < 1) {
    return 15;
  }

  return Math.min(Math.floor(raw), 100);
}

export function getPage(request: NextRequest): number {
  const raw = Number(request.nextUrl.searchParams.get("page") ?? "1");

  if (!Number.isFinite(raw) || raw < 1) {
    return 1;
  }

  return Math.floor(raw);
}

export function buildPaginatedResponse<T>(
  request: NextRequest,
  items: T[],
  total: number,
  page: number,
  perPage: number
) {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? null : (page - 1) * perPage + 1;
  const to = total === 0 ? null : Math.min(page * perPage, total);
  const path = request.nextUrl.origin + request.nextUrl.pathname;

  const pageUrl = (targetPage: number) =>
    `${path}?page=${targetPage}&per_page=${perPage}`;

  return {
    data: items,
    links: {
      first: pageUrl(1),
      last: pageUrl(lastPage),
      prev: page > 1 ? pageUrl(page - 1) : null,
      next: page < lastPage ? pageUrl(page + 1) : null,
    },
    meta: {
      current_page: page,
      from,
      last_page: lastPage,
      path,
      per_page: perPage,
      to,
      total,
    },
  };
}
