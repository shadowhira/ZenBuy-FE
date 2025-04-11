'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18nConfig from '../../../i18nConfig';
import { Globe } from "lucide-react"
import { Button } from "@components/ui/button"
import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"

export default function SimpleLanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (newLocale: string) => {
    // Set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // Normalize pathname (remove duplicate locale)
    let segments = currentPathname.split('/').filter(Boolean);

    // If the first element of the URL is the old locale, replace it
    if (i18nConfig.locales.includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale); // If there is no locale, add a new one
    }

    // Create new path
    const newPathname = '/' + segments.join('/');

    // Navigate to the new URL
    router.push(newPathname);
    router.refresh();
  };

  // Don't render the dropdown until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Globe className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleChange('en')}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleChange('vi')}>
            Tiếng Việt
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleChange('ja')}>
            日本語
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleChange('zh')}>
            中文
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
