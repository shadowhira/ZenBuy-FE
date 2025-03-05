import Navbar from "@components/layout/navbar";
import AllProducts from "./all-products";
import CategoryCarousel from "./category-carousel";
import FeaturedProducts from "./featured-products";
import Hero from "./hero";
import Footer from "@components/layout/footer";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
                    <Navbar />
        <Hero />
        <CategoryCarousel />
        <FeaturedProducts />
        <AllProducts />
                    <Footer />
      </main>
    </div>
  )
}

export default LandingPage;