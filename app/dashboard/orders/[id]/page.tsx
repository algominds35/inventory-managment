"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"

type OrderItem = {
  id: string
  quantity: number
  price_per_unit: number
  skus: {
    sku_name: string
  }
}

type Order = {
  id: string
  client_name: string
  order_date: string
  status: string
  created_at: string
  order_items: OrderItem[]
}

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadOrder()
  }, [params.id])

  const loadOrder = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            skus (
              sku_name
            )
          )
        `)
        .eq("id", params.id as string)
        .eq("user_id", user.id)
        .single()

      if (error) throw error

      setOrder(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      })
      router.push("/dashboard/orders")
    } finally {
      setLoading(false)
    }
  }

  const markAsFulfilled = async () => {
    if (!order) return

    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: "fulfilled",
          updated_at: new Date().toISOString()
        })
        .eq("id", order.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Order marked as fulfilled",
      })

      loadOrder()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const calculateTotal = () => {
    if (!order) return 0
    return order.order_items.reduce((sum, item) => sum + (item.quantity * item.price_per_unit), 0)
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

  if (!order) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Order not found</p>
          <Link href="/dashboard/orders">
            <Button className="mt-4">Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 mt-1">Order ID: {order.id.slice(0, 8)}</p>
        </div>
        {order.status !== "fulfilled" && (
          <Button onClick={markAsFulfilled}>
            Mark as Fulfilled
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Client Name</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{order.client_name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Order Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{format(new Date(order.order_date), "MMM dd, yyyy")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={order.status === "fulfilled" ? "success" : "default"} className="text-lg">
              {order.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          {order.order_items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No items in this order</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price per Unit</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.order_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.skus.sku_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price_per_unit.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          ${(item.quantity * item.price_per_unit).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Order ID</span>
            <span className="font-medium">{order.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Created At</span>
            <span className="font-medium">
              {format(new Date(order.created_at), "MMM dd, yyyy HH:mm")}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Number of Items</span>
            <span className="font-medium">{order.order_items.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
