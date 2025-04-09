"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@components/ui/input"
import { Button } from "@components/ui/button"
import { Label } from "@components/ui/label"
import { Textarea } from "@components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Barcode, Package, RefreshCw, Search } from "lucide-react"
import BarcodeScannerCamera from "@components/bar-code/scanner-camera"
import BarcodeScannerImage from "@components/bar-code/scanner-image"


// Updated category structure
console.log('Loading categories...')
// This will be replaced with data from API
const staticCategories = [
  {
    id: "uncategorized",
    name: "Uncategorized",
    subcategories: [],
  },
  {
    id: "electronics",
    name: "Electronics",
    subcategories: [
      {
        id: "computers",
        name: "Computers",
        subsubcategories: [
          { id: "laptops", name: "Laptops" },
          { id: "desktops", name: "Desktops" },
          { id: "tablets", name: "Tablets" },
        ],
      },
      {
        id: "phones",
        name: "Phones & Accessories",
        subsubcategories: [
          { id: "smartphones", name: "Smartphones" },
          { id: "cases", name: "Cases" },
          { id: "chargers", name: "Chargers" },
        ],
      },
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    subcategories: [
      {
        id: "mens",
        name: "Men's Clothing",
        subsubcategories: [
          { id: "shirts", name: "Shirts" },
          { id: "pants", name: "Pants" },
          { id: "shoes", name: "Shoes" },
        ],
      },
      {
        id: "womens",
        name: "Women's Clothing",
        subsubcategories: [
          { id: "dresses", name: "Dresses" },
          { id: "tops", name: "Tops" },
          { id: "shoes", name: "Shoes" },
        ],
      },
    ],
  },
  // Add more categories as needed
]

interface ProductFormProps {
  initialData?: any
}

export interface BarcodeData {
  productName: string
  sku: string
  quantity: string
  unitPrice: string
  supplier: string
  notes: string
  imageUrls: string[]
}

export default function ProductForm({ initialData }: ProductFormProps) {
  // We're using staticCategories directly now
  const [loading, setLoading] = useState(false)

  // We're not fetching categories from API for now

  const [formData, setFormData] = useState({
    productName: initialData?.title || "",
    categoryId: initialData?.category?._id || "",
    category: initialData?.category?.name || "",
    subcategoryId: "",
    subcategory: "", // Would need to extract from initialData if available
    subsubcategoryId: "",
    subsubcategory: "", // Would need to extract from initialData if available
    price: initialData?.price?.toString() || "",
    description: initialData?.description || "",
    images: initialData?.images || [],
    video: initialData?.video || "",
  })
  const [activeTab, setActiveTab] = useState<string>("manual")
  const [activeQrTab, setActiveQrTab] = useState<string>("camera")

  const [selectedCategory, setSelectedCategory] = useState(initialData?.category?.id || "")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState("")
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleQRScanComplete = (data: BarcodeData) => {
    setFormData(prev => ({
      ...prev,
      productName: data.productName || prev.productName,
      price: data.unitPrice || prev.price,
      description: data.notes || prev.description,
    }))

    // Switch back to manual tab to show the populated form
    setActiveTab("manual")
  }

  const resetForm = () => {
    setFormData({
      productName: "",
      categoryId: "",
      category: "",
      subcategoryId: "",
      subcategory: "",
      subsubcategoryId: "",
      subsubcategory: "",
      price: "",
      description: "",
      images: [],
      video: "",
    })
    setSelectedCategory("")
    setSelectedSubcategory("")
    setSelectedSubsubcategory("")
  }

  const handleCategoryConfirm = () => {
    // Log selected values for debugging
    console.log('Confirming category selection:', {
      selectedCategory,
      selectedSubcategory,
      selectedSubsubcategory
    })

    // Store both ID and name for each category level
    setFormData((prev) => {
      const categoryName = staticCategories.find((c) => c.id === selectedCategory)?.name || ""
      const subcategoryName = staticCategories
        .find((c) => c.id === selectedCategory)
        ?.subcategories.find((s) => s.id === selectedSubcategory)?.name || ""
      const subsubcategoryName = staticCategories
        .find((c) => c.id === selectedCategory)
        ?.subcategories.find((s) => s.id === selectedSubcategory)
        ?.subsubcategories.find((ss) => ss.id === selectedSubsubcategory)?.name || ""

      console.log('Setting category data:', {
        categoryId: selectedCategory,
        categoryName,
        subcategoryId: selectedSubcategory,
        subcategoryName,
        subsubcategoryId: selectedSubsubcategory,
        subsubcategoryName
      })

      return {
        ...prev,
        categoryId: selectedCategory,
        category: categoryName,
        subcategoryId: selectedSubcategory,
        subcategory: subcategoryName,
        subsubcategoryId: selectedSubsubcategory,
        subsubcategory: subsubcategoryName,
      }
    })
    setShowCategoryDialog(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Product form submitted:", formData)

    try {
      // If we have initialData, this is an edit operation
      if (initialData) {
        console.log("Updating existing product with ID:", initialData._id || initialData.id)
        // Call update API
        const response = await fetch(`/api/seller/products/${initialData._id || initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.productName,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.categoryId, // Send the category ID instead of name
            // Add other fields as needed
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update product')
        }

        alert('Product updated successfully!')
      } else {
        console.log("Creating new product")
        // Call create API
        // Log what we're sending to the API
        const productData = {
          title: formData.productName,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.categoryId, // Send the category ID instead of name
          stock: 0, // Default stock
        }
        console.log('Sending product data to API:', productData)

        const response = await fetch('/api/seller/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        })

        // Log the response for debugging
        const responseData = await response.clone().json()
        console.log('API response:', responseData)

        if (!response.ok) {
          const errorMessage = responseData.details || responseData.error || 'Failed to create product'
          throw new Error(errorMessage)
        }

        alert('Product added successfully!')
        // Reset form after successful submission
        setFormData({
          productName: "",
          categoryId: "",
          category: "",
          subcategoryId: "",
          subcategory: "",
          subsubcategoryId: "",
          subsubcategory: "",
          price: "",
          description: "",
          images: [],
          video: "",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      alert(`Error: ${errorMessage}`)
    }
  }

  return (
    <div className="container max-w-4xl py-6">
      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Manual Entry</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <Barcode className="h-4 w-4" />
              <span>QR Code</span>
            </TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm" onClick={resetForm} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Form
          </Button>
        </div>

        <TabsContent value="manual">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" name="productName" value={formData.productName} onChange={handleChange} required />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="w-full h-10 px-3 py-2 text-sm border rounded-md"
                  value={selectedCategory}
                  onChange={(e) => {
                    console.log('Selected category:', e.target.value)
                    setSelectedCategory(e.target.value)
                    setSelectedSubcategory('')
                    setSelectedSubsubcategory('')
                  }}
                >
                  <option value="">Select Category</option>
                  {staticCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <div className="space-y-2">
                  <Label>Subcategory</Label>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md"
                    value={selectedSubcategory}
                    onChange={(e) => {
                      console.log('Selected subcategory:', e.target.value)
                      setSelectedSubcategory(e.target.value)
                      setSelectedSubsubcategory('')
                    }}
                  >
                    <option value="">Select Subcategory</option>
                    {staticCategories
                      .find((c) => c.id === selectedCategory)
                      ?.subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {selectedSubcategory && (
                <div className="space-y-2">
                  <Label>Sub-subcategory</Label>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md"
                    value={selectedSubsubcategory}
                    onChange={(e) => {
                      console.log('Selected subsubcategory:', e.target.value)
                      setSelectedSubsubcategory(e.target.value)
                    }}
                  >
                    <option value="">Select Sub-subcategory</option>
                    {staticCategories
                      .find((c) => c.id === selectedCategory)
                      ?.subcategories.find((sc) => sc.id === selectedSubcategory)
                      ?.subsubcategories.map((subsubcategory) => (
                        <option key={subsubcategory.id} value={subsubcategory.id}>
                          {subsubcategory.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {(selectedCategory || selectedSubcategory || selectedSubsubcategory) && (
                <Button
                  onClick={handleCategoryConfirm}
                  className="mt-2"
                >
                  Confirm Category Selection
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Images</Label>
              <Input id="images" name="images" type="file" multiple accept="image/*" onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">Video</Label>
              <Input id="video" name="video" type="file" accept="video/*" onChange={handleChange} />
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit" className="w-full md:w-auto">
                {initialData ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="qr">
          <Card>
            <CardHeader>
              <CardTitle>Scan Product QR Code</CardTitle>
              <CardDescription>
                Scan a product QR code to automatically fill in product details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="camera" value={activeQrTab} onValueChange={setActiveQrTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="camera">Camera</TabsTrigger>
                  <TabsTrigger value="image">Upload Image</TabsTrigger>
                </TabsList>
                <TabsContent value="camera" className="mt-4">
                  <BarcodeScannerCamera onScanComplete={handleQRScanComplete} />
                </TabsContent>
                <TabsContent value="image" className="mt-4">
                  <BarcodeScannerImage onScanComplete={handleQRScanComplete} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
