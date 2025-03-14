import { MessageCircle, Store, Star } from "lucide-react";
import { Button } from "@components/ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";

interface ShopInfoProps {
  shop: {
    shopName: string;
    shopAvatar: string;
  };
}

export default function ShopInfo({ shop }: ShopInfoProps) {
  const { t } = useTranslation("detail-product");

  const onGoShop = () => {
    redirect("/shop/1");
  };

  return (
    <div className="mt-12 p-6 border rounded-lg">
      <div className="flex items-center">
        <Image
          src={shop.shopAvatar || "/placeholder.svg"}
          alt={shop.shopName}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div className="ml-4">
          <h2 className="text-xl font-bold">{shop.shopName}</h2>
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm">
              4.8 (1.2k {t("ratings")})
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
          <p className="text-lg font-semibold">1.2k</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("followers")}</p>
          <p className="text-lg font-semibold">10k</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("responseRate")}</p>
          <p className="text-lg font-semibold">98%</p>
        </div>
      </div>
    </div>
  );
}
