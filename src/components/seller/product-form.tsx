"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search } from "lucide-react"
import styles from "@/styles/seller.module.scss"

// Updated category structure
const categories = [
  {
    id: "1",
    name: "Thời Trang Nữ",
    subcategories: [
      {
        id: "1-1",
        name: "Áo",
        subsubcategories: ["Áo sơ mi", "Áo thun", "Áo khoác"],
      },
      {
        id: "1-2",
        name: "Quần",
        subsubcategories: ["Quần jean", "Quần tây", "Quần short"],
      },
    ],
  },
  {
    id: "2",
    name: "Thời Trang Nam",
    subcategories: [
      {
        id: "2-1",
        name: "Áo",
        subsubcategories: ["Áo sơ mi", "Áo thun", "Áo khoác"],
      },
      {
        id: "2-2",
        name: "Quần",
        subsubcategories: ["Quần jean", "Quần tây", "Quần short"],
      },
    ],
  },
  // Add more categories as needed
]

export default function ProductForm() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    subcategory: "",
    subsubcategory: "",
    price: "",
    description: "",
    images: [],
    video: "",
  })

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState("")
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryConfirm = () => {
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      subsubcategory: selectedSubsubcategory,
    }))
    setShowCategoryDialog(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Product form submitted:", formData)
    // Here you would typically send this data to your backend
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <Label htmlFor="productName">Product Name</Label>
        <Input id="productName" name="productName" value={formData.productName} onChange={handleChange} required />
      </div>

      <div className={styles.formGroup}>
        <Label>Category</Label>
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {formData.category
                ? `${formData.category} > ${formData.subcategory} > ${formData.subsubcategory}`
                : "Select Category"}
              <Search className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <Select onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setSelectedSubcategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory &&
                      categories
                        .find((c) => c.id === selectedCategory)
                        ?.subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setSelectedSubsubcategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sub-subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSubcategory &&
                      categories
                        .find((c) => c.id === selectedCategory)
                        ?.subcategories.find((sc) => sc.id === selectedSubcategory)
                        ?.subsubcategories.map((subsubcategory) => (
                          <SelectItem key={subsubcategory} value={subsubcategory}>
                            {subsubcategory}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCategoryConfirm}>Confirm</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className={styles.formGroup}>
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
      <div className={styles.formGroup}>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <Label htmlFor="images">Images</Label>
        <Input id="images" name="images" type="file" multiple accept="image/*" onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <Label htmlFor="video">Video</Label>
        <Input id="video" name="video" type="file" accept="video/*" onChange={handleChange} />
      </div>
      <Button type="submit">Add Product</Button>
    </form>
  )
}

