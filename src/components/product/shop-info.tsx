import { MessageCircle, Store, Star } from "lucide-react";
import { Button } from "@components/ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";
import type { Shop } from "@/types";

interface ShopInfoProps {
  shop: Shop;
}

export default function ShopInfo({ shop }: ShopInfoProps) {
  const { t } = useTranslation("detail-product");

  const onGoShop = () => {
    redirect(`/shop/${shop.id}`);
  };

  return (
    <div className="mt-12 p-6 border rounded-lg">
      <div className="flex items-center">
        <Image
          src={shop.logo || "/placeholder.svg"}
          alt={shop.name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div className="ml-4">
          <h2 className="text-xl font-bold">{shop.name}</h2>
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm">
              {shop.rating.toFixed(1)} ({shop.reviews} {t("ratings")})
            </span>
          </div>
        </div>
        <div className="ml-auto space-x-2">
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" /> {t("chatNow")}
          </Button>
          <Button onClick={onGoShop}>
            <Store className="mr-2 h-4 w-4" /> {t("viewShop")}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <p className="text-sm text-gray-500">{t("products")}</p>
          <p className="font-semibold">1.2k</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("followers")}</p>
          <p className="font-semibold">2.5k</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("responseRate")}</p>
          <p className="font-semibold">98%</p>
        </div>
      </div>
    </div>
  );
}
