import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LightRays } from "@/components/ui/light-rays";



export const metadata: Metadata = {
  title: "NUDGE CALLS",
  description: "Nudge calls that actually get you out of bed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased flex flex-col min-h-screen font-mono"
      >
        <LightRays />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
