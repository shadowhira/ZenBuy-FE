'use client'

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader } from "@zxing/library"
import Image from "next/image"
import { Camera, Loader2 } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Separator } from "@components/ui/separator"
import { Button } from "@components/ui/button"
import { Alert, AlertDescription } from "@components/ui/alert"

export interface BarcodeData {
  productName: string
  sku: string
  quantity: string
  unitPrice: string
  supplier: string
  notes: string
  imageUrls: string[]
}

interface BarcodeScannerCameraProps {
  onScanComplete?: (data: BarcodeData) => void
}

export default function BarcodeScannerCamera({ onScanComplete }: BarcodeScannerCameraProps) {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)
  const [barcodeData, setBarcodeData] = useState<BarcodeData>({
    productName: "",
    sku: "",
    quantity: "",
    unitPrice: "",
    supplier: "",
    notes: "",
    imageUrls: [],
  })
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    let codeReader: BrowserMultiFormatReader | null = null

    const startScanning = async () => {
      try {
        // Initialize barcode reader
        codeReader = new BrowserMultiFormatReader()
        console.log("ZXing code reader initialized")

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Use back camera if available
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }

        // Start scanning for barcodes from video stream
        codeReader.decodeFromVideoDevice(
          null, // Device ID (undefined to use default camera)
          videoRef.current!,
          (result, err) => {
            if (result) {
              console.log('result: ', result)
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
              setIsScanning(false)
              stopScanning()
            }
            if (err && !(err instanceof Error)) {
              setError("Unable to scan barcode.")
            }
          }
        )
      } catch (err) {
        setError("Cannot access camera.")
        console.error(err)
        setIsScanning(false)
      }
    }

    const stopScanning = () => {
      if (codeReader) {
        codeReader.reset() // Stop scanning
        codeReader = null
      }
      
      // Stop video stream
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }

    if (isScanning) {
      startScanning()
    }

    return () => {
      stopScanning()
    }
  }, [isScanning, onScanComplete])

  const handleReset = () => {
    setResult(null)
    setError(null)
    setBarcodeData({
      productName: "",
      sku: "",
      quantity: "",
      unitPrice: "",
      supplier: "",
      notes: "",
      imageUrls: [],
    })
    setIsScanning(true)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Camera Scanner</CardTitle>
            <CardDescription>
              Position the QR code in front of your camera
            </CardDescription>
          </div>
          {!isScanning && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              Scan Again
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isScanning ? (
            <div className="relative overflow-hidden rounded-lg border bg-muted/50">
              <video 
                ref={videoRef} 
                className="aspect-video w-full object-cover"
              ></video>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-lg border-2 border-dashed border-primary/50 p-20"></div>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-xs">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Scanning...</span>
                </div>
              </div>
            </div>
          ) : null}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && !error && (
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