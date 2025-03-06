"use client"

import { useState } from "react"
import { ArrowRight, Barcode, Package, RefreshCw, Save } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import BarcodeScannerCamera from "@components/bar-code/scanner-camera"
import BarcodeScannerImage from "@components/bar-code/scanner-image"

interface InventoryItem {
  productName: string
  sku: string
  quantity: string
  unitPrice: string
  supplier: string
  notes: string
  images: File[]
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

export default function InventoryForm() {
  const [formData, setFormData] = useState<InventoryItem>({
    productName: "",
    sku: "",
    quantity: "",
    unitPrice: "",
    supplier: "",
    notes: "",
    images: [],
  })

  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [activeQrTab, setActiveQrTab] = useState<string>("camera")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setFormData((prev) => ({ ...prev, images: files }))
      
      // Create preview URLs
      const urls = files.map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
  }

  const handleQRScanComplete = (data: BarcodeData) => {
    setFormData({
      productName: data.productName || "",
      sku: data.sku || "",
      quantity: data.quantity || "",
      unitPrice: data.unitPrice || "",
      supplier: data.supplier || "",
      notes: data.notes || "",
      images: [],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Inventory form submitted:", formData)
    // Here you would typically send this data to your backend
  }

  const resetForm = () => {
    setFormData({
      productName: "",
      sku: "",
      quantity: "",
      unitPrice: "",
      supplier: "",
      notes: "",
      images: [],
    })
    setPreviewUrls([])
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground">Add new items to your inventory using manual entry or QR code scanning.</p>
      </div>
      
      <Tabs defaultValue="manual" className="space-y-6">
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
          <Card>
            <CardHeader>
              <CardTitle>Add New Inventory Item</CardTitle>
              <CardDescription>
                Fill in the details below to add a new product to your inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="inventory-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input 
                      id="sku" 
                      name="sku" 
                      value={formData.sku} 
                      onChange={handleChange} 
                      placeholder="Enter SKU"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="0"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Unit Price</Label>
                    <Input
                      id="unitPrice"
                      name="unitPrice"
                      type="number"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input 
                      id="supplier" 
                      name="supplier" 
                      value={formData.supplier} 
                      onChange={handleChange} 
                      placeholder="Enter supplier name"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="images" className="block">Images</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="images" 
                        name="images" 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="flex-1"
                      />
                    </div>
                    
                    {previewUrls.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative h-16 w-16 overflow-hidden rounded-md border">
                            <img 
                              src={url || "/placeholder.svg"} 
                              alt={`Preview ${index}`} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleChange}
                    placeholder="Additional information about this product..."
                    rows={4}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="submit" form="inventory-form" className="gap-2">
                <Save className="h-4 w-4" />
                Add to Inventory
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="qr">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Scanning</CardTitle>
              <CardDescription>
                Scan a QR code to automatically fill in product details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs 
                defaultValue="camera" 
                value={activeQrTab}
                onValueChange={setActiveQrTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="camera">Camera</TabsTrigger>
                  <TabsTrigger value="upload">Upload Image</TabsTrigger>
                </TabsList>
                <TabsContent value="camera">
                  <BarcodeScannerCamera onScanComplete={handleQRScanComplete} />
                </TabsContent>
                <TabsContent value="upload">
                  <BarcodeScannerImage onScanComplete={handleQRScanComplete} />
                </TabsContent>
              </Tabs>
              
              {(formData.productName || formData.sku) && (
                <>
                  <Separator />
                  <div className="flex justify-end">
                    <Button type="submit" form="inventory-form" className="gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Continue to Edit
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}