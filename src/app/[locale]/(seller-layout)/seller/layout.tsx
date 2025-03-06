"use client"

import type React from "react"
import { useState } from "react"
import SellerNavbar from "@/components/seller/seller-navbar"
import SellerSidebar from "@/components/seller/seller-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SidebarProvider defaultOpen={true} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SellerSidebar />
      <SidebarInset>
        <div className="flex h-16 items-center border-b">
          <SellerNavbar />
        </div>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

