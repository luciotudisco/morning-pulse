"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function CallbackPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await refreshUser();
        router.push("/");
      } catch (error) {
        toast.error("Oops! Something went wrong. Please try again.");
        router.push("/login");
      }
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

