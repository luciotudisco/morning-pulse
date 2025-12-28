"use client";

import { useEffect } from "react";

export default function LoginPage() {

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    window.location.href = `${apiUrl}/login`;
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-muted-foreground mb-8">Redirecting to login...</p>
      </div>
    </div>
  );
}

