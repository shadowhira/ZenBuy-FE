import ProductCard from "@/components/search/product-card"

const products = [
  { id: 1, name: "Smartphone X", price: 599.99, image: "https://th.bing.com/th?q=Sword+Cartoon+Vector&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=2&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247", rating: 4 },
  { id: 2, name: "Laptop Pro", price: 1299.99, image: "https://th.bing.com/th?q=Sword+Cartoon+Vector&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=2&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247", rating: 5 },
  { id: 3, name: "Wireless Earbuds", price: 149.99, image: "https://th.bing.com/th?q=Sword+Cartoon+Vector&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=2&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247", rating: 4 },
  { id: 4, name: "4K Smart TV", price: 799.99, image: "https://th.bing.com/th?q=Sword+Cartoon+Vector&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=2&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247", rating: 5 },
  { id: 5, name: "Fitness Tracker", price: 99.99, image: "https://th.bing.com/th?q=Sword+Cartoon+Vector&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=2&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247", rating: 4 },
  { id: 6, name: "Smart Watch", price: 249.99, image: "https://th.bing.com/th?q=Sword+Cartoon+Vector&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=2&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247", rating: 4 },
  { id: 7, name: "Bluetooth Speaker", price: 79.99, image: "https://th.bing.com/th?q=Sword+Cartoon+Vector&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=2&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247", rating: 3 },
  { id: 8, name: "Gaming Console", price: 399.99, image: "https://th.bing.com/th?q=Sword+Cartoon+Vector&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=2&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247", rating: 5 },
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

