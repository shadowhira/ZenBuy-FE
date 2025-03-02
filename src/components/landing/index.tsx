import AllProducts from "./all-products";
import CategoryCarousel from "./category-carousel";
import FeaturedProducts from "./featured-products";
import Hero from "./hero";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <CategoryCarousel />
        <FeaturedProducts />
        <AllProducts />
      </main>
    </div>
  )
}

export default LandingPage;