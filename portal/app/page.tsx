"use client";

import Link from "next/link";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function Home() {
  return (
      <main className="container mx-auto px-4 md:px-16 text-center flex flex-col min-h-screen pt-[15vh]">
        <div className="mx-auto w-full md:max-w-2xl">
            <AnimatedShinyText className="text-foreground">
              Your personal AI accountability partner
            </AnimatedShinyText>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Get the push you need.
            </h1>
            <p className="mt-4 text-pretty sm:text-lg">
              Schedule a nudge call to help you wake up, hit the gym,
              or get started on your goals. Friendly, persistent, and effective.
            </p>
            <RainbowButton size="lg" className="mt-6 md:w-auto w-full text-base">
              <Link href="/alarm">Schedule a Nudge</Link>
            </RainbowButton>
        </div>
      </main>
  );
}
