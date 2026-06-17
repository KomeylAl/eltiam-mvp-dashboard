"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiClientError } from "@/lib/api/client";
import type { CreatePatientPayload, UpdatePatientPayload } from "@/types/api";

interface PatientFormProps {
  initialValues?: {
    name: string;
    phone: string;
  };
  submitLabel: string;
  onSubmit: (data: CreatePatientPayload | UpdatePatientPayload) => Promise<void>;
  requirePassword?: boolean;
}

export function PatientForm({
  initialValues,
  submitLabel,
  onSubmit,
  requirePassword = true,
}: PatientFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const payload: CreatePatientPayload | UpdatePatientPayload = { name, phone };
      if (password || requirePassword) {
        (payload as CreatePatientPayload).password = password;
      }
      await onSubmit(payload);
    } catch (error) {
      if (error instanceof ApiClientError) {
        const fieldErrors: Record<string, string> = {};
        if (error.errors) {
          for (const [key, messages] of Object.entries(error.errors)) {
            fieldErrors[key] = messages[0];
          }
        }
        if (!Object.keys(fieldErrors).length) {
          fieldErrors.general = error.message;
        }
        setErrors(fieldErrors);
      } else {
        setErrors({ general: "خطایی رخ داد. دوباره تلاش کنید." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.general}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">نام بیمار</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: علی رضایی"
          required
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">شماره موبایل</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09121234567"
          dir="ltr"
          className="text-left"
          required
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          رمز عبور
          {!requirePassword && (
            <span className="text-muted-foreground font-normal mr-1">
              (اختیاری — برای تغییر)
            </span>
          )}
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={requirePassword ? "حداقل ۸ کاراکتر" : "خالی بگذارید اگر نمی‌خواهید تغییر دهید"}
          dir="ltr"
          className="text-left"
          required={requirePassword}
          minLength={requirePassword ? 8 : undefined}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "در حال ذخیره..." : submitLabel}
      </Button>
    </form>
  );
}
