"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@components/ui/button"
import { useTranslation } from "react-i18next"
import { useSidebar } from "@components/ui/sidebar"
import ThemeChanger from "@components/utils/theme-changer"
import DirectLanguageSwitcher from "@components/utils/direct-language-switcher"
import DirectProfileMenu from "@components/utils/direct-profile-menu"

export default function SellerHeader() {
  const { t } = useTranslation("seller")
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-gray-900 dark:text-white px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="flex-1">
        <h1 className="text-xl font-semibold hidden md:block">{t("sellerPortal")}</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeChanger />
        <DirectLanguageSwitcher />

        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">{t("notifications")}</span>
        </Button>

        <DirectProfileMenu />
      </div>
    </header>
  )
}
