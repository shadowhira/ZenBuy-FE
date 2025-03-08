import type React from "react"
import Navbar from "@components/layout/navbar"
import Footer from "@components/layout/footer"
import { ReactNode } from "react"

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({
  children
}: RootLayoutProps) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
