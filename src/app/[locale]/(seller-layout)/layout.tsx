"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import SellerSidebar from "@components/seller/seller-sidebar"
import SellerHeader from "@components/seller/seller-header"
import { SidebarProvider } from "@components/ui/sidebar"
import { useAuthCheck } from "@hooks/use-auth-check"
import { Skeleton } from "@components/ui/skeleton"
import { ThemeProvider } from "@components/providers/theme-provider"
import { Toaster } from "@components/ui/sonner"
import "./seller.css"

export default function SellerLayout({ children }: { children: ReactNode }) {
  const { data: authData, isLoading, error } = useAuthCheck()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!authData?.authenticated || error)) {
      router.push('/login')
    }
  }, [authData, isLoading, error, router])

  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
          <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
            <Skeleton className="h-8 w-32 mb-6 dark:bg-gray-700" />
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full mb-2 dark:bg-gray-700" />
            ))}
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-16 border-b dark:border-gray-700 flex items-center justify-between px-6">
              <Skeleton className="h-8 w-32 dark:bg-gray-700" />
              <Skeleton className="h-8 w-8 rounded-full dark:bg-gray-700" />
            </div>
            <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-800">
              <div className="grid gap-4">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full dark:bg-gray-700" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    )
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
          <SellerSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <SellerHeader />
            <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-800 dark:text-white">{children}</main>
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
    </ThemeProvider>
  )
}
