"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingBag, BarChart2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "@/styles/seller.module.scss"
import { Button } from "@components/ui/button"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Package, label: "Inventory", href: "/seller/inventory" },
  { icon: ShoppingBag, label: "Products", href: "/seller/products" },
  { icon: BarChart2, label: "Analytics", href: "/seller/analytics" },
  { icon: ShoppingBag, label: "Shop Edit", href: "/seller/shop-edit" },
]

export default function Sidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const pathname = usePathname()

  return (
    <aside className={cn(styles.sidebar, open && styles.open)}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Seller Center</h2>
        <Button onClick={() => setOpen(false)} className={styles.closeButton}>
          <X size={24} />
        </Button>
      </div>
      <nav className={styles.sidebarNav}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(styles.navItem, pathname === item.href && styles.active)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

