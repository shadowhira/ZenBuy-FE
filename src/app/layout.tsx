import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/src/components/layout/navbar"
import Footer from "@/src/components/layout/footer"
import './globals.css'
import i18nConfig from "@/i18nConfig"
import initTranslations from "./i18n"
import { ReactNode } from "react"
import { cookies } from "next/headers";
import TranslationsProvider from "../components/providers/translation-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zen Buy",
  description: "Your one-stop shop for all things trendy and essential",
    generator: 'v0.dev'
}

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}
interface RootLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

const i18nNamespaces = ['landing', '(default)'];

export default async function RootLayout({
  children,
  params
}: RootLayoutProps) {
  const cookieStore = cookies();
  const locale = (await cookieStore).get('NEXT_LOCALE')?.value || params.locale;
  const { resources,  } = await initTranslations(locale, i18nNamespaces);

  if (children === null || (children as any).type.name === 'notfound') {
    return <html><body>{children}</body></html>;
  }

  return (
    <html lang={locale} >
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <TranslationsProvider
            locale={locale}
            namespaces={i18nNamespaces}
            resources={resources}
          >
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </TranslationsProvider>
        </div>
      </body>
    </html>
  )
}
