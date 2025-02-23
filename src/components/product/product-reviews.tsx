import { Star } from "lucide-react"

interface ProductReviewsProps {
  productId: number
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  // Fetch reviews based on productId
  const reviews = [
    { id: 1, user: "John Doe", rating: 5, comment: "Great product! Highly recommended." },
    { id: 2, user: "Jane Smith", rating: 4, comment: "Good quality, but a bit pricey." },
  ]

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="border-b py-4">
          <div className="flex items-center">
            <p className="font-semibold">{review.user}</p>
            <div className="flex ml-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${index < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

