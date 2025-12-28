"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { UserAvatar } from "@/components/Avatar";
import type { User } from "@/lib/schemas";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    window.location.href = `${apiUrl}/logout`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-foreground">NUDGE CALLS</h1>
        </Link>
        <nav className="flex items-center space-x-4">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <UserAvatar user={user} onLogout={handleLogout} />
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground border border-border rounded hover:bg-accent"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

