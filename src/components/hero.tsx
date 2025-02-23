import { Button } from "@/src/components/ui/button"

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Zen Buy</h1>
            <p className="text-xl mb-6">Discover a world of amazing products at unbeatable prices.</p>
            <Button size="lg" variant="secondary">
              Shop Now
            </Button>
          </div>
          <div className="hidden md:block">
            <img src="/hero-image.svg" alt="Shopping illustration" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

