"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { GuestGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiClientError, getFieldError } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterPage() {
  return (
    <GuestGuard>
      <RegisterForm />
    </GuestGuard>
  );
}

function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await register({ name, phone, password });
      toast.success("ثبت‌نام با موفقیت انجام شد!");
      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrors({
          name: getFieldError(error.errors, "name") ?? "",
          phone: getFieldError(error.errors, "phone") ?? "",
          password: getFieldError(error.errors, "password") ?? "",
          general: error.errors ? "" : error.message,
        });
      } else {
        setErrors({ general: "خطا در اتصال به سرور" });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">التیام</h1>
          <p className="text-muted-foreground mt-1">ثبت‌نام تراپیست</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ثبت‌نام</CardTitle>
            <CardDescription>حساب تراپیست جدید بسازید</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errors.general}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="دکتر سارا محمدی"
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
                  placeholder="09123334444"
                  dir="ltr"
                  className="text-left"
                  required
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="حداقل ۸ کاراکتر"
                  dir="ltr"
                  className="text-left"
                  required
                  minLength={8}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                ورود
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
