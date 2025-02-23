import ProductCard from "@/components/search/product-card"

const products = [
  { id: 1, name: "Smartphone X", price: 599.99, image: "/product1.jpg", rating: 4 },
  { id: 2, name: "Laptop Pro", price: 1299.99, image: "/product2.jpg", rating: 5 },
  { id: 3, name: "Wireless Earbuds", price: 149.99, image: "/product3.jpg", rating: 4 },
  { id: 4, name: "4K Smart TV", price: 799.99, image: "/product4.jpg", rating: 5 },
  { id: 5, name: "Fitness Tracker", price: 99.99, image: "/product5.jpg", rating: 4 },
  { id: 6, name: "Smart Watch", price: 249.99, image: "/product6.jpg", rating: 4 },
  { id: 7, name: "Bluetooth Speaker", price: 79.99, image: "/product7.jpg", rating: 3 },
  { id: 8, name: "Gaming Console", price: 399.99, image: "/product8.jpg", rating: 5 },
]

export default function ShopProducts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

