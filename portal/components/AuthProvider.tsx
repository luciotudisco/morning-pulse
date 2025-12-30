"use client"

import { AuthProvider as AuthContextProvider } from "@/contexts/AuthContext"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </AuthContextProvider>
  )
}
