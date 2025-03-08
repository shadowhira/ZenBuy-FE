import { Button } from "@components/ui/button"

const categories = ["All Products", "Smartphones", "Laptops", "Accessories", "Smart Home", "Audio", "Wearables"]

export default function ShopCategories() {
  return (
    <div className="flex space-x-2 overflow-x-auto py-4">
      {categories.map((category) => (
        <Button key={category} variant="outline">
          {category}
        </Button>
      ))}
    </div>
  )
}

