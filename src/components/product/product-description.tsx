interface ProductDescriptionProps {
  description: string
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Product Description</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}

