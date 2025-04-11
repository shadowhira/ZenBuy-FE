"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { Separator } from "@components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@components/ui/alert-dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useProductVariants, useCreateProductVariant, useUpdateProductVariant, useDeleteProductVariant } from "@hooks/use-product-variants"
import { ProductVariant } from "@/types"

interface ProductVariantsProps {
  productId: string
}

export default function ProductVariants({ productId }: ProductVariantsProps) {
  const { data: variants, isLoading } = useProductVariants(productId)
  const createVariant = useCreateProductVariant(productId)
  const updateVariant = useUpdateProductVariant(productId, "")
  const deleteVariant = useDeleteProductVariant(productId)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    attributes: {} as Record<string, string>,
  })
  const [attributeKey, setAttributeKey] = useState("")
  const [attributeValue, setAttributeValue] = useState("")

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add attribute to form data
  const handleAddAttribute = () => {
    if (attributeKey.trim() && attributeValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attributeKey]: attributeValue,
        },
      }))
      setAttributeKey("")
      setAttributeValue("")
    }
  }

  // Remove attribute from form data
  const handleRemoveAttribute = (key: string) => {
    setFormData((prev) => {
      const newAttributes = { ...prev.attributes }
      delete newAttributes[key]
      return { ...prev, attributes: newAttributes }
    })
  }

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      attributes: {},
    })
    setAttributeKey("")
    setAttributeValue("")
  }

  // Open edit dialog with variant data
  const handleEditClick = (variant: ProductVariant) => {
    setCurrentVariant(variant)
    setFormData({
      name: variant.name,
      price: variant.price.toString(),
      stock: variant.stock.toString(),
      attributes: { ...variant.attributes },
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog with variant data
  const handleDeleteClick = (variant: ProductVariant) => {
    setCurrentVariant(variant)
    setIsDeleteDialogOpen(true)
  }

  // Handle form submission for adding a variant
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createVariant.mutate({
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      attributes: formData.attributes,
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false)
        resetForm()
      }
    })
  }

  // Handle form submission for editing a variant
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentVariant?._id) return

    updateVariant.mutate({
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      attributes: formData.attributes,
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false)
        resetForm()
      }
    })
  }

  // Handle variant deletion
  const handleDelete = () => {
    if (!currentVariant?._id) return

    deleteVariant.mutate(currentVariant._id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        setCurrentVariant(null)
      }
    })
  }

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Variants</CardTitle>
          <CardDescription>Manage variants for this product</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product Variant</DialogTitle>
              <DialogDescription>
                Create a new variant for this product with different attributes, price, and stock.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Variant Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Large / Red"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Attributes</Label>
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2">
                    <Input
                      value={attributeKey}
                      onChange={(e) => setAttributeKey(e.target.value)}
                      placeholder="Key (e.g., Color)"
                    />
                    <Input
                      value={attributeValue}
                      onChange={(e) => setAttributeValue(e.target.value)}
                      placeholder="Value (e.g., Red)"
                    />
                    <Button type="button" onClick={handleAddAttribute} size="sm">
                      Add
                    </Button>
                  </div>
                </div>
                {Object.keys(formData.attributes).length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Current Attributes:</h4>
                    <ul className="space-y-1">
                      {Object.entries(formData.attributes).map(([key, value]) => (
                        <li key={key} className="flex items-center justify-between text-sm">
                          <span>
                            <strong>{key}:</strong> {value}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAttribute(key)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createVariant.isPending}>
                  {createVariant.isPending ? "Adding..." : "Add Variant"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading variants...</div>
        ) : variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No variants found. Add your first variant to offer different options for this product.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => (
                <TableRow key={variant._id}>
                  <TableCell className="font-medium">{variant.name}</TableCell>
                  <TableCell>{formatPrice(variant.price)}</TableCell>
                  <TableCell>{variant.stock}</TableCell>
                  <TableCell>
                    {Object.entries(variant.attributes).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(variant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(variant)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product Variant</DialogTitle>
              <DialogDescription>
                Update the details for this product variant.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Variant Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Large / Red"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-price">Price</Label>
                    <Input
                      id="edit-price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-stock">Stock</Label>
                    <Input
                      id="edit-stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>Attributes</Label>
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2">
                    <Input
                      value={attributeKey}
                      onChange={(e) => setAttributeKey(e.target.value)}
                      placeholder="Key (e.g., Color)"
                    />
                    <Input
                      value={attributeValue}
                      onChange={(e) => setAttributeValue(e.target.value)}
                      placeholder="Value (e.g., Red)"
                    />
                    <Button type="button" onClick={handleAddAttribute} size="sm">
                      Add
                    </Button>
                  </div>
                </div>
                {Object.keys(formData.attributes).length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Current Attributes:</h4>
                    <ul className="space-y-1">
                      {Object.entries(formData.attributes).map(([key, value]) => (
                        <li key={key} className="flex items-center justify-between text-sm">
                          <span>
                            <strong>{key}:</strong> {value}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAttribute(key)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateVariant.isPending}>
                  {updateVariant.isPending ? "Updating..." : "Update Variant"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the variant "{currentVariant?.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                {deleteVariant.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
