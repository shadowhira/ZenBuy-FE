'use client';

import { User } from "lucide-react"
import { Button } from "@components/ui/button"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from 'react'

export default function DirectProfileMenu() {
  const { t } = useTranslation("seller")
  const [mounted, setMounted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  // Don't render the dropdown until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full">
        <User className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={() => setShowMenu(!showMenu)}
      >
        <User className="h-5 w-5" />
        <span className="sr-only">{t("userMenu")}</span>
      </Button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-sm font-medium border-b">
              {t("myAccount")}
            </div>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleNavigation('/seller/profile')}
            >
              {t("profile")}
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleNavigation('/seller/settings')}
            >
              {t("settings")}
            </button>
            <div className="border-t my-1"></div>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
              onClick={() => handleNavigation('/logout')}
            >
              {t("logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
