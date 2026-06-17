"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { PageLoading } from "@/components/shared/loading-spinner";

export default function HomePage() {
  const router = useRouter();
  const { token, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    router.replace(token ? "/dashboard" : "/login");
  }, [isHydrated, token, router]);

  return <PageLoading />;
}
