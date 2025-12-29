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
              Your personal AI accountability partner
            </AnimatedShinyText>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Get the push you need.
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">
              Schedule a nudge call from an AI agent to help you wake up, hit the gym,
              or get started on your goals. Friendly, persistent, and effective.
            </p>
            <RainbowButton size="lg" className="mt-6">
              <Link href="/alarm">Schedule a Nudge</Link>
            </RainbowButton>
          </div>
        </div>
      </main>

    </div>
  );
}
