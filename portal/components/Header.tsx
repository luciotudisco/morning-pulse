"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "@/components/Avatar";

export function Header() {
  const { user, isLoading, logout } = useAuth();

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
            <UserAvatar user={user} onLogout={logout} />
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

