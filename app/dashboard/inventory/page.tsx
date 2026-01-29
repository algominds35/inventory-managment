"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Pencil, Trash2, Box } from "lucide-react"

type SKU = {
  id: string
  sku_name: string
  current_quantity: number
  low_stock_threshold: number
  created_at: string
}

export default function InventoryPage() {
  const [skus, setSKUs] = useState<SKU[]>([])
  const [filteredSKUs, setFilteredSKUs] = useState<SKU[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSKU, setEditingSKU] = useState<SKU | null>(null)
  const [formData, setFormData] = useState({
    sku_name: "",
    current_quantity: 0,
    low_stock_threshold: 0,
  })
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadSKUs()
  }, [])

  useEffect(() => {
    const filtered = skus.filter(sku =>
      sku.sku_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSKUs(filtered)
  }, [searchTerm, skus])

  const loadSKUs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("skus")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setSKUs(data || [])
      setFilteredSKUs(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (sku?: SKU) => {
    if (sku) {
      setEditingSKU(sku)
      setFormData({
        sku_name: sku.sku_name,
        current_quantity: sku.current_quantity,
        low_stock_threshold: sku.low_stock_threshold,
      })
    } else {
      setEditingSKU(null)
      setFormData({
        sku_name: "",
        current_quantity: 0,
        low_stock_threshold: 0,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSKU(null)
    setFormData({
      sku_name: "",
      current_quantity: 0,
      low_stock_threshold: 0,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (editingSKU) {
        // Update existing SKU
        const { error } = await supabase
          .from("skus")
          .update({
            sku_name: formData.sku_name,
            current_quantity: formData.current_quantity,
            low_stock_threshold: formData.low_stock_threshold,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingSKU.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "SKU updated successfully",
        })
      } else {
        // Create new SKU
        const { error } = await supabase
          .from("skus")
          .insert([
            {
              user_id: user.id,
              sku_name: formData.sku_name,
              current_quantity: formData.current_quantity,
              low_stock_threshold: formData.low_stock_threshold,
            },
          ])

        if (error) throw error

        toast({
          title: "Success",
          description: "SKU added successfully",
        })
      }

      handleCloseModal()
      loadSKUs()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save SKU",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SKU?")) return

    try {
      const { error } = await supabase
        .from("skus")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "SKU deleted successfully",
      })

      loadSKUs()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete SKU",
        variant: "destructive",
      })
    }
  }

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (quantity <= threshold) return { label: "Low Stock", variant: "warning" as const }
    return { label: "In Stock", variant: "success" as const }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your SKUs and stock levels</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add New SKU
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search SKUs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredSKUs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No SKUs found</p>
              <p className="text-sm mt-1">
                {searchTerm ? "Try a different search term" : "Add your first SKU to get started"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU Name</TableHead>
                    <TableHead>Current Quantity</TableHead>
                    <TableHead>Low Stock Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSKUs.map((sku) => {
                    const status = getStockStatus(sku.current_quantity, sku.low_stock_threshold)
                    return (
                      <TableRow key={sku.id}>
                        <TableCell className="font-medium">{sku.sku_name}</TableCell>
                        <TableCell>{sku.current_quantity}</TableCell>
                        <TableCell>{sku.low_stock_threshold}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenModal(sku)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(sku.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit SKU Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSKU ? "Edit SKU" : "Add New SKU"}</DialogTitle>
            <DialogDescription>
              {editingSKU ? "Update the SKU details below" : "Enter the details for the new SKU"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sku_name">SKU Name</Label>
                <Input
                  id="sku_name"
                  placeholder="e.g., WIDGET-001"
                  value={formData.sku_name}
                  onChange={(e) => setFormData({ ...formData, sku_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_quantity">Current Quantity</Label>
                <Input
                  id="current_quantity"
                  type="number"
                  min="0"
                  value={formData.current_quantity}
                  onChange={(e) => setFormData({ ...formData, current_quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                <Input
                  id="low_stock_threshold"
                  type="number"
                  min="0"
                  value={formData.low_stock_threshold}
                  onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 0 })}
                  required
                />
                <p className="text-xs text-gray-500">
                  You'll be alerted when quantity falls below this threshold
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSKU ? "Update SKU" : "Add SKU"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
