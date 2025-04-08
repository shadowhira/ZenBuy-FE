"use client"

import { usePathname } from "next/navigation"
import { Home, Package, ShoppingBag, BarChart2, StoreIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@components/ui/sidebar"
import { redirect } from "next/navigation"
import Image from "next/image"
import logo from "@images/Zenera.webp"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/seller/dashboard" },
  { icon: Package, label: "Inventory", href: "/seller/inventory" },
  { icon: ShoppingBag, label: "Products", href: "/seller/products" },
  { icon: BarChart2, label: "Analytics", href: "/seller/analytics" },
  { icon: StoreIcon, label: "Shop Edit", href: "/seller/shop-edit" },
]

export default function SellerSidebar() {
  const pathname = usePathname()
  const onGoHome = () => {
    redirect('/')
  }

  return (
    <Sidebar collapsible="icon" className="border-r bg-gray-100 text-black w-auto flex items-center">
      <SidebarHeader className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold group-data-[collapsible=icon]:hidden">Seller Center</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="hover:bg-gray-200 data-[active=true]:bg-gray-200"
              >
                <a href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div className="flex-shrink-0 cursor-pointer flex justify-center mb-2" onClick={() => onGoHome()}>
        <Image src={logo} alt="Zenera Logo" width={60} height={60} className="border-4 border-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full" />
      </div>
    </Sidebar>
  )
}
