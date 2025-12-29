"use client";

import Link from "next/link";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function Home() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="relative mx-auto max-w-2xl overflow-hidden p-8 sm:p-12">
          <div className="relative z-10 text-center">
            <AnimatedShinyText>
              A wake-up call that actually works
            </AnimatedShinyText>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Wake up, on purpose.
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">
              Schedule a quick nudge call that gets you moving—simple, friendly,
              and hard to ignore.
            </p>
          </div>
        </div>

        <section className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-col items-center gap-3 sm:items-center">
            <RainbowButton asChild size="lg">
              <Link href="/alarm">Set my alarm</Link>
            </RainbowButton>
          </div>
        </section>
      </main>

    </div>
  );
}
