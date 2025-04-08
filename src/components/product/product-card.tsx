"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { cn } from "@lib/utils";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@hooks/use-cart";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    description?: string;
    category?: {
      _id: string;
      name: string;
      slug: string;
    };
    images: string[];
    rating?: number;
    stock: number;
    slug: string;
  };
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const addToCart = useAddToCart();
  const [isLoading, setIsLoading] = useState(false);

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/placeholder.svg";

  const handleClick = () => {
    router.push(`/product/${product._id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    addToCart.mutate(
      {
        productId: product._id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          toast.success(t("addedToCart"));
          setIsLoading(false);
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : t("errorAddingToCart"));
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Card 
      onClick={handleClick} 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer hover:scale-105 hover:border-primary",
        className
      )}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={product.title || "Product image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.category && (
            <Badge className="absolute top-2 left-2 bg-primary/80 hover:bg-primary">
              {product.category.name}
            </Badge>
          )}
          {product.stock <= 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              {t("outOfStock")}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1 mb-2">
          {product.description || ""}
        </p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
          {product.rating !== undefined && (
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < product.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={isLoading || product.stock <= 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t("addToCart")}
        </Button>
      </CardFooter>
    </Card>
  );
}
