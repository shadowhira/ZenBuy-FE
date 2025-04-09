"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"
import { Badge } from "@components/ui/badge"
import { Skeleton } from "@components/ui/skeleton"
import { productsService } from "@services/products.service"
import { Product } from "@/types"
import Link from "next/link"
import Image from "next/image"

export default function SellerProductsListPage() {
  const { t } = useTranslation("seller")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productsService.getSellerProducts()
        setProducts(response.products || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category?.name === categoryFilter

    const matchesStatus = statusFilter === "all" ||
                          (statusFilter === "inStock" && (product.stock || 0) > 0) ||
                          (statusFilter === "outOfStock" && (product.stock || 0) === 0)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(products.map(product => product.category?.name))].filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("products") || "Products"}</h2>
          <p className="text-muted-foreground">
            {t("manageYourProducts") || "Manage your products and inventory"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/seller/products/qr-generator">
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
              {t("generateQR") || "Generate QR"}
            </Button>
          </Link>
          <Link href="/seller/products">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("addProduct") || "Add Product"}
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("productInventory") || "Product Inventory"}</CardTitle>
          <CardDescription>
            {t("totalProducts", { count: products.length }) ||
             `You have ${products.length} products in your inventory.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchProducts") || "Search products..."}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t("category") || "Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allCategories") || "All Categories"}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category || ""}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t("status") || "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatus") || "All Status"}</SelectItem>
                  <SelectItem value="inStock">{t("inStock") || "In Stock"}</SelectItem>
                  <SelectItem value="outOfStock">{t("outOfStock") || "Out of Stock"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("product") || "Product"}</TableHead>
                    <TableHead>{t("category") || "Category"}</TableHead>
                    <TableHead className="text-right">{t("price") || "Price"}</TableHead>
                    <TableHead className="text-center">{t("stock") || "Stock"}</TableHead>
                    <TableHead className="text-center">{t("status") || "Status"}</TableHead>
                    <TableHead className="text-right">{t("actions") || "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {t("noProductsFound") || "No products found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product._id || product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 relative rounded-md overflow-hidden">
                              {product.images && product.images[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.title || "Product"}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">No image</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{product.title}</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {product._id || product.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category?.name || "-"}</TableCell>
                        <TableCell className="text-right">${product.price?.toFixed(2)}</TableCell>
                        <TableCell className="text-center">{product.stock || 0}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={(product.stock || 0) > 0 ? "default" : "destructive"}>
                            {(product.stock || 0) > 0
                              ? (t("inStock") || "In Stock")
                              : (t("outOfStock") || "Out of Stock")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t("openMenu") || "Open menu"}</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t("actions") || "Actions"}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link href={`/seller/products/edit/${product._id || product.id}`}>
                                <DropdownMenuItem>
                                  {t("edit") || "Edit"}
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem>
                                {t("duplicate") || "Duplicate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                {t("delete") || "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
