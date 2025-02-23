import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbProps {
  category: Category
  subcategory: string
  productName: string
}

type Category = {
  id: number
  name: string
  image: string
}

export default function Breadcrumb({ category, subcategory, productName }: BreadcrumbProps) {
  const { name: categoryName } = category
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
          <Link href={`/category/${categoryName.toLowerCase()}`} className="text-gray-700 hover:text-blue-600">
            {categoryName}
          </Link>
        </li>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <li className="inline-flex items-center">
          <Link
            href={`/category/${categoryName.toLowerCase()}/${subcategory.toLowerCase()}`}
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

