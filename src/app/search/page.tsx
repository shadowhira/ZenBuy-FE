import Navbar from "@/src/components/layout/navbar"
import Header from "@/src/components/layout/header"
import SearchHero from "@/src/components/search/search-hero"
import SearchResults from "@/src/components/search/search-results"
import Footer from "@/src/components/layout/footer"

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

