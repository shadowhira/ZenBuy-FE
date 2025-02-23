import Breadcrumb from "@/components/product/breadcrumb"
import ProductDetails from "@/components/product/product-details"
import ShopInfo from "@/components/product/shop-info"
import ProductDescription from "@/components/product/product-description"
import ProductReviews from "@/components/product/product-reviews"
import ShopProducts from "@/components/product/shop-products"
import SimilarProducts from "@/components/product/similar-products"

export default function ProductPage({ params }: { params: { id: string } }) {
  // Fetch product data using params.id
  const product = {
    id: params.id,
    name: "Sample Product",
    category: "Electronics",
    subcategory: "Smartphones",
    price: 999.99,
    rating: 4.5,
    reviews: 120,
    images: ["/product1.jpg", "/product2.jpg", "/product3.jpg", "/product4.jpg"],
    description: "This is a sample product description.",
    shopName: "Tech Store",
    shopAvatar: "/shop-avatar.jpg",
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb category={product.category} subcategory={product.subcategory} productName={product.name} />
      <ProductDetails product={product} />
      <ShopInfo shop={product} />
      <ProductDescription description={product.description} />
      <ProductReviews productId={product.id} />
      <ShopProducts shopName={product.shopName} />
      <SimilarProducts category={product.category} />
    </div>
  )
}

