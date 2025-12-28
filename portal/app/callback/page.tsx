"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/alarm");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-muted-foreground mb-8">Completing login...</p>
      </div>
    </div>
  );
}

