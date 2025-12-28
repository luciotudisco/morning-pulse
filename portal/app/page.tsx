"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="flex-1 w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 pb-2">
                Wake Up Calls That Actually Work
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-xl md:text-2xl leading-relaxed">
                Stop snoozing your life away. Get reliable, personalized wake-up calls tailored to your schedule.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-w-[300px] justify-center">
              <Link
                href="/alarm"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-105 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-muted bg-background px-8 text-base font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
