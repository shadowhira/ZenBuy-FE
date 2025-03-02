'use client'

import { Button } from "@/src/components/ui/button"
import { redirect } from 'next/navigation';

export default function Hero() {
  const handleShopNowClick = () => {
    redirect('/search')
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <h1 className="text-4xl font-bold mb-4">Welcome to Zen Buy</h1>
            <p className="text-xl mb-6">Discover a world of amazing products at unbeatable prices.</p>
            <Button size="lg" variant="secondary" onClick={handleShopNowClick}>
              Shop Now
            </Button>
          </div>
          <div className="hidden md:block">
            <video autoPlay loop muted className="w-full border-8 border-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-xl">
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  )
}
