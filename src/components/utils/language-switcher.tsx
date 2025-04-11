'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18nConfig from '../../../i18nConfig';
import { Globe } from "lucide-react"
import { Button } from "@components/ui/button"
import { useState, useEffect } from 'react'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover"

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

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

    // Close the popover
    setOpen(false);

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="end">
        <div className="flex flex-col">
          <Button 
            variant="ghost" 
            className={`justify-start rounded-none ${currentLocale === 'en' ? 'bg-accent' : ''}`}
            onClick={() => handleChange('en')}
          >
            English
          </Button>
          <Button 
            variant="ghost" 
            className={`justify-start rounded-none ${currentLocale === 'vi' ? 'bg-accent' : ''}`}
            onClick={() => handleChange('vi')}
          >
            Tiếng Việt
          </Button>
          <Button 
            variant="ghost" 
            className={`justify-start rounded-none ${currentLocale === 'ja' ? 'bg-accent' : ''}`}
            onClick={() => handleChange('ja')}
          >
            日本語
          </Button>
          <Button 
            variant="ghost" 
            className={`justify-start rounded-none ${currentLocale === 'zh' ? 'bg-accent' : ''}`}
            onClick={() => handleChange('zh')}
          >
            中文
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
