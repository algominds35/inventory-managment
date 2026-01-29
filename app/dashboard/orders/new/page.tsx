"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, AlertTriangle } from "lucide-react"

type SKU = {
  id: string
  sku_name: string
  current_quantity: number
}

type LineItem = {
  sku_id: string
  quantity: number
  price_per_unit: number
}

export default function CreateOrderPage() {
  const [skus, setSKUs] = useState<SKU[]>([])
  const [clientName, setClientName] = useState("")
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0])
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { sku_id: "", quantity: 1, price_per_unit: 0 }
  ])
  const [loading, setLoading] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadSKUs()
  }, [])

  useEffect(() => {
    checkStockWarnings()
  }, [lineItems, skus])

  const loadSKUs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("skus")
        .select("id, sku_name, current_quantity")
        .eq("user_id", user.id)
        .order("sku_name")

      if (error) throw error

      setSKUs(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load SKUs",
        variant: "destructive",
      })
    }
  }

  const checkStockWarnings = () => {
    const newWarnings: string[] = []
    
    lineItems.forEach((item, index) => {
      if (!item.sku_id) return
      
      const sku = skus.find(s => s.id === item.sku_id)
      if (sku && item.quantity > sku.current_quantity) {
        newWarnings.push(`Line ${index + 1}: ${sku.sku_name} - Ordering ${item.quantity} but only ${sku.current_quantity} available`)
      }
    })

    setWarnings(newWarnings)
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { sku_id: "", quantity: 1, price_per_unit: 0 }])
  }

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!clientName) {
      toast({
        title: "Error",
        description: "Please enter a client name",
        variant: "destructive",
      })
      return
    }

    if (lineItems.some(item => !item.sku_id)) {
      toast({
        title: "Error",
        description: "Please select a SKU for all line items",
        variant: "destructive",
      })
      return
    }

    if (lineItems.some(item => item.quantity <= 0)) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      })
      return
    }

    // Show warning if overselling
    if (warnings.length > 0) {
      const confirmed = confirm(
        `Warning: You are ordering more than available stock:\n\n${warnings.join('\n')}\n\nDo you want to proceed anyway?`
      )
      if (!confirmed) return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            client_name: clientName,
            order_date: orderDate,
            status: "pending",
          },
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItemsData = lineItems.map(item => ({
        order_id: order.id,
        sku_id: item.sku_id,
        quantity: item.quantity,
        price_per_unit: item.price_per_unit,
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData)

      if (itemsError) throw itemsError

      // Deduct quantities from SKUs
      for (const item of lineItems) {
        const sku = skus.find(s => s.id === item.sku_id)
        if (sku) {
          const newQuantity = Math.max(0, sku.current_quantity - item.quantity)
          
          const { error: updateError } = await supabase
            .from("skus")
            .update({ 
              current_quantity: newQuantity,
              updated_at: new Date().toISOString()
            })
            .eq("id", item.sku_id)

          if (updateError) throw updateError
        }
      }

      toast({
        title: "Success",
        description: "Order created successfully",
      })

      router.push("/dashboard/orders")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Order</h1>
        <p className="text-gray-500 mt-1">Add a new order and deduct inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  placeholder="Acme Corp"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_date">Order Date</Label>
                <Input
                  id="order_date"
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-900">Stock Warnings</h4>
                    <ul className="mt-2 space-y-1 text-sm text-yellow-800">
                      {warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {lineItems.map((item, index) => {
              const selectedSKU = skus.find(s => s.id === item.sku_id)
              
              return (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>SKU</Label>
                    <Select
                      value={item.sku_id}
                      onValueChange={(value) => updateLineItem(index, "sku_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SKU" />
                      </SelectTrigger>
                      <SelectContent>
                        {skus.map((sku) => (
                          <SelectItem key={sku.id} value={sku.id}>
                            {sku.sku_name} (Available: {sku.current_quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Price/Unit</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price_per_unit}
                      onChange={(e) => updateLineItem(index, "price_per_unit", parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            })}

            <Button
              type="button"
              variant="outline"
              onClick={addLineItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Line Item
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating Order..." : "Create Order"}
          </Button>
        </div>
      </form>
    </div>
  )
}
