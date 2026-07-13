export function toNumber(value: bigint | number | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

export function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function formatTimestamp(value: Date | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const iso = value.toISOString();
  return iso.replace(/\.(\d{3})Z$/, (_, ms) => `.${ms}000Z`);
}
