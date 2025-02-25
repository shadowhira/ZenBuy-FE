import heroImage from '@images/landing-page/heroImgEcommerce.webp'
import Image from 'next/image'

export default function SearchHero() {
  return (
    <div className="relative bg-blue-900 text-white h-[400px]">
      <div className="absolute inset-0">
        <Image src='https://img.freepik.com/premium-photo/abstract-art-flowing-interconnected-shapes_878092-4336.jpg' alt="Search background" layout="fill" objectFit="cover" objectPosition="center" className="w-full h-full object-cover opacity-70"  />
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

