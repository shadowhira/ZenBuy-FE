import Hero from "@/components/hero"
import CategoryCarousel from "@/components/category-carousel"
import FeaturedProducts from "@/components/featured-products"
import AllProducts from "@/components/all-products"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      {/* <Header /> */}
      <main className="flex-grow">
        <Hero />
        <CategoryCarousel />
        <FeaturedProducts />
        <AllProducts />
      </main>
      {/* <Footer /> */}
    </div>
  )
}

