'use client';

import Image from "next/image"
import { useTranslation } from "react-i18next"

export default function SearchHero() {
  const { t } = useTranslation("searchPage");
  return (
    <div className="relative bg-primary text-primary-foreground h-[400px]">
      <div className="absolute inset-0">
        <Image
          src="https://img.freepik.com/premium-photo/abstract-art-flowing-interconnected-shapes_878092-4336.jpg"
          alt="Search background"
          fill
          priority
          className="object-cover opacity-70"
        />
      </div>
      <div className="relative container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4 md:text-5xl lg:text-6xl">{t('findYourPerfectProduct')}</h1>
        <p className="text-xl max-w-3xl mb-8">
          {t('exploreProducts')}
        </p>
      </div>
    </div>
  )
}

