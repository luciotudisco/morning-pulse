"use client";

import Link from "next/link";

export function Header() {
  const handleLogout = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    window.location.href = `${apiUrl}/logout`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-foreground">NUDGE CALLS</h1>
        </Link>
        <nav className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

