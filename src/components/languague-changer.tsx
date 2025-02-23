'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18nConfig from '../../i18nConfig';

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

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
    <div>
      <label htmlFor='language-select'>Choose language:</label>
      <select
        id='language-select'
        onChange={handleChange}
        value={currentLocale}
      >
        <option value='en'>English</option>
        <option value='ja'>Japanese</option>
        <option value='vi'>Vietnamese</option>
      </select>
    </div>
  );
}
