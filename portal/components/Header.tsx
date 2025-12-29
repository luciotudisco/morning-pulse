"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "@/components/Avatar";

export function Header() {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/50 dark:via-blue-950/50 dark:to-indigo-950/50 backdrop-blur-md supports-backdrop-filter:bg-gradient-to-r supports-backdrop-filter:from-purple-50/95 supports-backdrop-filter:via-blue-50/95 supports-backdrop-filter:to-indigo-50/95 dark:supports-backdrop-filter:from-purple-950/80 dark:supports-backdrop-filter:via-blue-950/80 dark:supports-backdrop-filter:to-indigo-950/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-blue-700 group-hover:to-indigo-700 dark:group-hover:from-purple-300 dark:group-hover:via-blue-300 dark:group-hover:to-indigo-300 transition-all">
            NUDGE CALLS
          </h1>
        </Link>
        <nav className="flex items-center space-x-4">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse" />
          ) : user ? (
            <UserAvatar user={user} onLogout={logout} />
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

