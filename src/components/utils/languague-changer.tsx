'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18nConfig from '../../../i18nConfig';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { Button } from "@components/ui/button"
import { useState, useEffect } from 'react'

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" defaultValue={currentLocale}>
        <DropdownMenuItem onClick={() => handleChange('en')}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange('vi')}>Tiếng Việt</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange('ja')}>日本語</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange('zh')}>中文</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
