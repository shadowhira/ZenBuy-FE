'use client'

import { useState } from 'react'
import QRCode from 'qrcode.react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Label } from '@components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import { Download, Loader2 } from 'lucide-react'

export interface ProductBarcodeData {
  productName: string
  unitPrice: string
  notes: string
  imageUrls: string[]
}

export default function ProductQRGenerator() {
  const [barcodeData, setBarcodeData] = useState<ProductBarcodeData>({
    productName: '',
    unitPrice: '',
    notes: '',
    imageUrls: [],
  })
  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setBarcodeData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const urls = files.map((file) => URL.createObjectURL(file))
      setBarcodeData((prev) => ({ ...prev, imageUrls: urls }))
    }
  }

  const generateBarcode = () => {
    setLoading(true)
    
    // Convert the data to a JSON string
    const jsonData = JSON.stringify(barcodeData)
    
    // Create a canvas element to render the QR code
    const canvas = document.createElement('canvas')
    QRCode.toCanvas(canvas, jsonData, { width: 512 }, (error) => {
      if (error) {
        console.error('Error generating QR code:', error)
        setLoading(false)
        return
      }
      
      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL('image/png')
      setBarcodeUrl(dataUrl)
      setLoading(false)
    })
  }

  const downloadQRCode = () => {
    if (!barcodeUrl) return
    
    const link = document.createElement('a')
    link.href = barcodeUrl
    link.download = `product-qr-${barcodeData.productName.replace(/\s+/g, '-').toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Product QR Code Generator</CardTitle>
        <CardDescription>
          Create a QR code for your product that can be scanned to quickly add it to your inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            name="productName"
            value={barcodeData.productName}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unitPrice">Unit Price</Label>
          <Input
            id="unitPrice"
            name="unitPrice"
            type="number"
            step="0.01"
            value={barcodeData.unitPrice}
            onChange={handleInputChange}
            placeholder="Enter unit price"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Description/Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={barcodeData.notes}
            onChange={handleInputChange}
            placeholder="Enter product description or notes"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="images">Product Images</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </div>
        
        <Button 
          onClick={generateBarcode} 
          disabled={loading || !barcodeData.productName}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate QR Code'
          )}
        </Button>
        
        {barcodeUrl && (
          <div className="mt-6 flex flex-col items-center">
            <div className="border p-4 rounded-lg bg-white">
              <img src={barcodeUrl} alt="Product QR Code" className="w-64 h-64" />
            </div>
            <Button 
              variant="outline" 
              onClick={downloadQRCode} 
              className="mt-4 gap-2"
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
