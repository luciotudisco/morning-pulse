"use client";

import Link from "next/link";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

export default function Home() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-muted-foreground">
            A wake-up call that actually works
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            <AnimatedShinyText>Wake up, on purpose.</AnimatedShinyText>
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">
            Schedule a quick nudge call that gets you moving—simple, friendly,
            and hard to ignore.
          </p>
        </div>

        <section className="mx-auto mt-10 max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/12),transparent_55%)]"
            />
            <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div className="max-w-xl">
                <h2 className="text-xl font-semibold text-foreground">
                  Ready to set your first nudge call?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick a time, choose your vibe, and let the next morning take
                  care of itself.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 sm:items-end">
                <Link
                  href="/alarm"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Set my alarm
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Already have an account? Log in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
