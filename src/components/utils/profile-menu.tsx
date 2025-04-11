'use client';

import { User } from "lucide-react"
import { Button } from "@components/ui/button"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from 'react'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover"

export default function ProfileMenu() {
  const { t } = useTranslation("seller")
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (path: string) => {
    setOpen(false);
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
          <span className="sr-only">{t("userMenu")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <div className="p-2 border-b">
          <p className="font-medium">{t("myAccount")}</p>
        </div>
        <div className="flex flex-col">
          <Button 
            variant="ghost" 
            className="justify-start rounded-none"
            onClick={() => handleNavigation('/seller/profile')}
          >
            {t("profile")}
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start rounded-none"
            onClick={() => handleNavigation('/seller/settings')}
          >
            {t("settings")}
          </Button>
          <div className="h-px bg-border my-1"></div>
          <Button 
            variant="ghost" 
            className="justify-start rounded-none text-red-500 hover:text-red-500 hover:bg-red-50"
            onClick={() => handleNavigation('/logout')}
          >
            {t("logout")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
