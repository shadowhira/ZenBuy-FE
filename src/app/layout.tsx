import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import './globals.css'
import { ReactNode } from "react"
import { cookies } from "next/headers";
import TranslationsProvider from "../components/providers/translation-provider"
import i18nConfig from "i18nConfig"
import initTranslations from "./i18n"
import { ReactQueryProvider } from "@components/providers/react-query-provider"
import { SuspenseWrapper } from "@components/providers/suspense-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zen Buy",
  description: "Your one-stop shop for all things trendy and essential",
  generator: 'v0.dev',
  icons: "/favicon.png",
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

const i18nNamespaces = ['landing', 'navbar-general', 'footer-general', "searchPage", "detail-product", "shopPage"];

export default async function RootLayout({
  children,
  params
}: RootLayoutProps) {
  const cookieStore = cookies();
  const locale = (await cookieStore).get('NEXT_LOCALE')?.value || params.locale;
  const { resources  } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale} >
      <body className={inter.className}>
        <ReactQueryProvider>
          <SuspenseWrapper>
            <div className="flex flex-col min-h-screen">
              <TranslationsProvider
                locale={locale}
                namespaces={i18nNamespaces}
                resources={resources}
              >
                <main className="flex-grow">{children}</main>
              </TranslationsProvider>
            </div>
          </SuspenseWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
