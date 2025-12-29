"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function CallbackPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    // After successful login, refresh user data and redirect
    const handleCallback = async () => {
      await refreshUser();
      router.push("/alarm");
    };
    handleCallback();
  }, [router, refreshUser]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-muted-foreground mb-8">Completing login...</p>
      </div>
    </div>
  );
}

