"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <main className="text-center">
        <h1 className="text-3xl font-semibold mb-4 text-foreground">NUDGE CALLS</h1>
        <p className="text-muted-foreground mb-8">
          Schedule your wake-up calls
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="inline-block px-6 py-2 border border-border rounded hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Login
          </Link>
          <Link
            href="/alarm"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Set Alarm
          </Link>
        </div>
      </main>
    </div>
  );
}
