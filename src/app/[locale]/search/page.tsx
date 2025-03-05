import SearchHero from "@/components/search/search-hero"
import SearchResults from "@/components/search/search-results"

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <SearchHero />
        <SearchResults />
      </main>
    </div>
  )
}
