import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbProps {
  category: string
  subcategory: string
  productName: string
}

export default function Breadcrumb({ category, subcategory, productName }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
        </li>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <li className="inline-flex items-center">
          <Link href={`/category/${category.toLowerCase()}`} className="text-gray-700 hover:text-blue-600">
            {category}
          </Link>
        </li>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <li className="inline-flex items-center">
          <Link
            href={`/category/${category.toLowerCase()}/${subcategory.toLowerCase()}`}
            className="text-gray-700 hover:text-blue-600"
          >
            {subcategory}
          </Link>
        </li>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <li>
          <span className="text-gray-500">{productName}</span>
        </li>
      </ol>
    </nav>
  )
}

