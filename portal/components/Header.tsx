"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "@/components/Avatar";
import { Button } from "./ui/button";
import { LogInIcon } from "lucide-react";

export function Header() {
  const { user, isLoading, logout, login } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full h-16 justify-between items-center px-4 flex bg-white border-b shadow-sm">
        <Link href="/" className="flex items-center space-x-2 group">
          <h1 className="text-xl font-semibold font-mono">
            NUDGE CALLS
          </h1>
        </Link>
        <nav>
          {isLoading ? (
            <div className="h-8 w-8 rounded-full" />
          ) : user ? (
            <UserAvatar user={user} onLogout={logout} />
          ) : (
            <Button
              variant="ghost"
              onClick={login}
            >
              <LogInIcon className="size-3" />
              Login
            </Button>
          )}
        </nav>
    </header>
  );
}

