"use client"

import type React from "react"

import { useState } from "react"
import styles from "@/styles/seller.module.scss"
import Sidebar from "@components/seller/sidebar"
import Navbar from "@components/seller/navbar"

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.sellerLayout}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={styles.mainContent}>
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  )
}

