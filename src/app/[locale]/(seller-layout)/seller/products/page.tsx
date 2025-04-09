import ProductForm from "@components/seller/product-form"

export default function ProductsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  )
}

