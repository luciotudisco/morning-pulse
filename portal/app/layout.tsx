import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LightRays } from "@/components/ui/light-rays";
import { Toaster } from "@/components/ui/sonner";



export const metadata: Metadata = {
  title: "NUDGE CALLS",
  description: "AI-powered nudge calls to help you achieve your goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased flex flex-col min-h-screen"
      >
        <LightRays />
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
