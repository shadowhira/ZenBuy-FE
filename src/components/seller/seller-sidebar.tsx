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
  { icon: ShoppingBag, label: "Products", href: "/seller/products/list" },
  { icon: BarChart2, label: "Analytics", href: "/seller/analytics" },
  { icon: StoreIcon, label: "Shop Edit", href: "/seller/shop-edit" },
]

export default function SellerSidebar() {
  const pathname = usePathname()
  const onGoHome = () => {
    redirect('/')
  }

  return (
    <Sidebar collapsible="icon" className="border-r bg-white text-black h-screen max-w-[16rem]">
      <SidebarHeader className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold group-data-[collapsible=icon]:hidden">Seller Center</h2>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between h-full">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.includes(item.href)}
                tooltip={item.label}
                className="hover:bg-gray-100 data-[active=true]:bg-gray-100 data-[active=true]:text-primary"
              >
                <a href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onGoHome()}>
            <Image src={logo} alt="Zenera Logo" width={40} height={40} className="rounded-full" />
            <span className="font-medium group-data-[collapsible=icon]:hidden">Zenera Shop</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
