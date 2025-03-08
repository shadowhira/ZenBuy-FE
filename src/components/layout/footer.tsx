'use client';

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("footer-general");

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("about")}</h3>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("customerService")}</h3>
            <ul className="space-y-2">
              <li><Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">{t("contact")}</Button></li>
              <li><Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">{t("faq")}</Button></li>
              <li><Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">{t("shipping")}</Button></li>
              <li><Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">{t("returns")}</Button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("quickLink")}</h3>
            <ul className="space-y-2">
              <li><Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">{t("home")}</Button></li>
              <li><Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">{t("products")}</Button></li>
              <li><Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">{t("aboutUs")}</Button></li>
              <li><Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">{t("blog")}</Button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("followUs")}</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Youtube className="h-5 w-5" /></Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">&copy; 2025 Zen Buy. {t("allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
}
