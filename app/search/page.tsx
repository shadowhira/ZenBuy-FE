import Navbar from "@/components/layout/navbar"
import Header from "@/components/layout/header"
import SearchHero from "@/components/search/search-hero"
import SearchResults from "@/components/search/search-results"
import Footer from "@/components/layout/footer"

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      {/* <Header /> */}
      <main className="flex-grow">
        <SearchHero />
        <SearchResults />
      </main>
      {/* <Footer /> */}
    </div>
  )
}

