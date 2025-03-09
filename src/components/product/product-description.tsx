import { useTranslation } from "react-i18next";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  const { t } = useTranslation("detail-product");

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{t("productDescription")}</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
