"use client";

import Link from "next/link";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { CheckCircle2, Phone, ClipboardCheck, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="mx-auto w-full max-w-3xl">
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              We call you at the time you choose—until you're up / moving / started.
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Get the push you need.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule a nudge call to help you wake up, hit the gym, or get started on your goals. Friendly, persistent, and effective.
            </p>
            <ul className="flex flex-col md:flex-row gap-4 justify-center mb-8 text-sm text-muted-foreground">
              <li className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Real humans
              </li>
              <li className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Starts in 30 seconds
              </li>
              <li className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Cancel anytime
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <RainbowButton size="lg" asChild>
                <Link href="/alarm">Schedule my nudge call</Link>
              </RainbowButton>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                See how it works &gt;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose a goal + time</h3>
            <p className="text-muted-foreground">Pick a goal and time that suits your schedule.</p>
          </div>
          <div className="bg-card rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get a nudge call</h3>
            <p className="text-muted-foreground">We call you at the chosen time and keep you accountable.</p>
          </div>
          <div className="bg-card rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Confirm it's done</h3>
            <p className="text-muted-foreground">Let us know you're up / moving / started... or reschedule.</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-lg text-muted-foreground">
            Trusted by over 20,000 people with 500,000+ nudge calls completed!
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-xl shadow-md p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                EJ
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm font-semibold">Emma J.</p>
              </div>
            </div>
            <p className="text-muted-foreground italic">
              "These calls really helped me stay consistent. Zero judgment and super motivating!"
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
