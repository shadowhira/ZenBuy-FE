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
import { useTranslation } from "react-i18next"

// Menu items will be populated with translations

export default function SellerSidebar() {
  const { t } = useTranslation("seller")
  const pathname = usePathname()
  const onGoHome = () => {
    redirect('/')
  }

  // Menu items with translations
  const menuItems = [
    { icon: Home, label: t("dashboard"), href: "/seller/dashboard" },
    { icon: Package, label: t("inventory"), href: "/seller/inventory" },
    { icon: ShoppingBag, label: t("products"), href: "/seller/products/list" },
    { icon: BarChart2, label: t("analytics"), href: "/seller/analytics" },
    { icon: StoreIcon, label: t("shop"), href: "/seller/shop-edit" },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r bg-white dark:bg-gray-900 dark:text-white text-black h-screen max-w-[16rem]">
      <SidebarHeader className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold group-data-[collapsible=icon]:hidden">{t("sellerPortal")}</h2>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between h-full">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.includes(item.href)}
                tooltip={item.label}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 data-[active=true]:bg-gray-100 dark:data-[active=true]:bg-gray-800 data-[active=true]:text-primary"
              >
                <a href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="mt-auto p-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onGoHome()}>
            <Image src={logo} alt="Zenera Logo" width={40} height={40} className="rounded-full" />
            <span className="font-medium group-data-[collapsible=icon]:hidden">{t("viewStore")}</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
