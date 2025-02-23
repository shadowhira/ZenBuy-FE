export default function SearchHero() {
  return (
    <div className="relative bg-blue-900 text-white">
      <div className="absolute inset-0">
        <img src="/search-hero.jpg" alt="Search background" className="w-full h-full object-cover opacity-50" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Product</h1>
        <p className="text-xl max-w-3xl">
          Explore our wide range of products and find exactly what you're looking for. Use the filters to narrow down
          your search and discover great deals.
        </p>
      </div>
    </div>
  )
}

