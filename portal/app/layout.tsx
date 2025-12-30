import type { Metadata } from "next"
import { Karla, Inconsolata } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/AuthProvider"
import { LightRays } from "@/components/ui/light-rays"
import { Toaster } from "@/components/ui/sonner"

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
})

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NUDGE CALLS",
  description: "AI-powered nudge calls to help you achieve your goals.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${karla.variable} ${inconsolata.variable} antialiased flex flex-col min-h-screen`}
      >
        <LightRays />
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
