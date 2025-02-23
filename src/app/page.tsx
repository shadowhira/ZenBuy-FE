import Hero from "@/src/components/hero"
import CategoryCarousel from "@/src/components/category-carousel"
import FeaturedProducts from "@/src/components/featured-products"
import AllProducts from "@/src/components/all-products"

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

