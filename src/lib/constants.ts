export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.eltiamcare.ir/api";

export const Q_NUMBER_LABELS: Record<number, string> = {
  0: "بار",
  1: "احساس تعلق",
  2: "تمایل به خودکشی",
};

export const A_NUMBER_LABELS: Record<number, string> = {
  0: "اصلاً",
  1: "خیلی کم",
  2: "متوسط",
  3: "زیاد",
  4: "خیلی زیاد",
};

export const RISK_LEVEL_LABELS: Record<number, string> = {
  3: "بالا",
  4: "بحرانی",
};

export const SOURCE_TYPE_LABELS: Record<string, string> = {
  measurement: "ارزیابی",
  intervention: "مداخله",
};
