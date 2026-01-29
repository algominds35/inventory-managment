"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, ShoppingCart, XCircle } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type SKU = {
  id: string
  sku_name: string
  current_quantity: number
  low_stock_threshold: number
}

type Order = {
  id: string
  client_name: string
  order_date: string
  status: string
  order_items: { id: string }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSKUs: 0,
    lowStockItems: 0,
    ordersThisWeek: 0,
    outOfStock: 0,
  })
  const [lowStockSKUs, setLowStockSKUs] = useState<SKU[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get all SKUs
      const { data: skus } = await supabase
        .from("skus")
        .select("*")
        .eq("user_id", user.id)

      // Calculate stats
      const totalSKUs = skus?.length || 0
      const lowStock = skus?.filter(sku => sku.current_quantity <= sku.low_stock_threshold && sku.current_quantity > 0) || []
      const outOfStock = skus?.filter(sku => sku.current_quantity === 0) || []

      // Get orders from this week
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const { data: orders } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .gte("order_date", oneWeekAgo.toISOString())

      setStats({
        totalSKUs,
        lowStockItems: lowStock.length,
        ordersThisWeek: orders?.length || 0,
        outOfStock: outOfStock.length,
      })

      setLowStockSKUs(lowStock)

      // Get recent 5 orders
      const { data: recentOrdersData } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("order_date", { ascending: false })
        .limit(5)

      setRecentOrders(recentOrdersData || [])
    } catch (error) {
      console.error("Error loading dashboard:", error)
    } finally {
      setLoading(false)
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your inventory and orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total SKUs
            </CardTitle>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSKUs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Orders This Week
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersThisWeek}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Out of Stock
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockSKUs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No low stock items</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockSKUs.map((sku) => {
                    const status = getStockStatus(sku.current_quantity, sku.low_stock_threshold)
                    return (
                      <TableRow key={sku.id}>
                        <TableCell className="font-medium">{sku.sku_name}</TableCell>
                        <TableCell>{sku.current_quantity}</TableCell>
                        <TableCell>{sku.low_stock_threshold}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
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

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/dashboard/orders">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead># Items</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-blue-600 hover:underline">
                          {order.id.slice(0, 8)}
                        </Link>
                      </TableCell>
                      <TableCell>{order.client_name}</TableCell>
                      <TableCell>{format(new Date(order.order_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{order.order_items?.length || 0}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "fulfilled" ? "success" : "default"}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
