'use client'

import { useState } from "react"
import { BrowserMultiFormatReader } from "@zxing/library"
import { FileUp, Loader2, Upload } from 'lucide-react'
import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Alert, AlertDescription } from "@components/ui/alert"
import { Badge } from "@components/ui/badge"
import { Separator } from "@components/ui/separator"

export interface BarcodeData {
  productName: string
  sku: string
  quantity: string
  unitPrice: string
  supplier: string
  notes: string
  imageUrls: string[]
}

interface BarcodeScannerImageProps {
  onScanComplete?: (data: BarcodeData) => void
}

export default function BarcodeScannerImage({ onScanComplete }: BarcodeScannerImageProps) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [barcodeData, setBarcodeData] = useState<BarcodeData | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      
      // Create preview URL
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      
      // Reset previous results
      setResult(null)
      setError(null)
      setBarcodeData(null)
    }
  }

  const handleScan = async () => {
    if (!file) return
    
    setIsScanning(true)
    setError(null)

    const reader = new FileReader()
    reader.onload = async (event) => {
      if (event.target?.result) {
        const imageSrc = event.target.result as string
        try {
          const codeReader = new BrowserMultiFormatReader()
          const result = await codeReader.decodeFromImageUrl(imageSrc)
          setResult(result.getText())
          
          try {
            const parsedData = JSON.parse(result.getText())
            setBarcodeData(parsedData)
            if (onScanComplete) {
              onScanComplete(parsedData)
            }
          } catch (parseErr) {
            setError("Invalid QR code format")
          }
        } catch (error) {
          setError("Could not detect a valid QR code in this image.")
        }
        setIsScanning(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setBarcodeData(null)
    setPreviewUrl(null)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Image Scanner</CardTitle>
            <CardDescription>
              Upload an image containing a QR code
            </CardDescription>
          </div>
          {(result || error) && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            {!previewUrl ? (
              <label htmlFor="qr-image-upload" className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 px-5 py-5 text-center hover:bg-muted/50">
                <FileUp className="mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max 10MB)</p>
                <Input 
                  id="qr-image-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image 
                  src={previewUrl || "/placeholder.svg"} 
                  alt="QR code image"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            
            {file && !result && !error && (
              <Button 
                onClick={handleScan} 
                disabled={isScanning}
                className="gap-2"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Scan QR Code</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {barcodeData && !error && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  QR Code Detected
                </Badge>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Product Name</p>
                      <p className="font-medium">{barcodeData.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">SKU</p>
                      <p className="font-medium">{barcodeData.sku}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                      <p className="font-medium">{barcodeData.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Unit Price</p>
                      <p className="font-medium">${barcodeData.unitPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                      <p className="font-medium">{barcodeData.supplier}</p>
                    </div>
                  </div>
                  
                  {barcodeData.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Notes</p>
                        <p className="text-sm">{barcodeData.notes}</p>
                      </div>
                    </>
                  )}
                  
                  {barcodeData.imageUrls && barcodeData.imageUrls.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Product Images</p>
                        <div className="grid grid-cols-3 gap-2">
                          {barcodeData.imageUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                              <Image 
                                src={url || "/placeholder.svg"} 
                                fill
                                alt={`Product image ${index + 1}`}
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}