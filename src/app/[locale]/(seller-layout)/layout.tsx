"use client"

import { ReactNode } from "react"
import SellerSidebar from "@components/seller/seller-sidebar"
import SellerHeader from "@components/seller/seller-header"
import { SidebarProvider } from "@components/ui/sidebar"
import "./seller.css"

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-white overflow-hidden">
        <SellerSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SellerHeader />
          <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
