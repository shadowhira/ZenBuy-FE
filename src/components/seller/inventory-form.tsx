"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import styles from "@/styles/seller.module.scss"

export default function InventoryForm() {
  const [formData, setFormData] = useState<{
    productName: string;
    sku: string;
    quantity: string;
    unitPrice: string;
    supplier: string;
    notes: string;
    images: File[];
  }>({
    productName: "",
    sku: "",
    quantity: "",
    unitPrice: "",
    supplier: "",
    notes: "",
    images: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, images: Array.from(e.target.files!) }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Inventory form submitted:", formData)
    // Here you would typically send this data to your backend
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <Label htmlFor="productName">Product Name</Label>
        <Input id="productName" name="productName" value={formData.productName} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <Label htmlFor="sku">SKU</Label>
        <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <Label htmlFor="unitPrice">Unit Price</Label>
        <Input
          id="unitPrice"
          name="unitPrice"
          type="number"
          step="0.01"
          value={formData.unitPrice}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <Label htmlFor="supplier">Supplier</Label>
        <Input id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <Label htmlFor="images">Images</Label>
        <Input id="images" name="images" type="file" multiple accept="image/*" onChange={handleImageChange} />
      </div>
      <Button type="submit">Add to Inventory</Button>
    </form>
  )
}

