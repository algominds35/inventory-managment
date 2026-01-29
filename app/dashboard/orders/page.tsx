"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, ShoppingCart, Download } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { exportToCSV } from "@/lib/export-csv"

type Order = {
  id: string
  client_name: string
  order_date: string
  status: string
  order_items: { id: string }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("order_date", { ascending: false })

      if (error) throw error

      setOrders(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    const exportData = orders.map(order => ({
      'Order ID': order.id.slice(0, 8),
      'Client Name': order.client_name,
      'Order Date': format(new Date(order.order_date), "MMM dd, yyyy"),
      'Number of Items': order.order_items?.length || 0,
      'Status': order.status
    }))
    exportToCSV(exportData, 'orders')
    toast({
      title: "Success",
      description: "Orders exported to CSV",
    })
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
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">View and manage all orders</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            onClick={handleExportCSV} 
            variant="outline" 
            className="flex-1 md:flex-initial"
            disabled={orders.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Link href="/dashboard/orders/new" className="flex-1 md:flex-initial">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No orders yet</p>
              <p className="text-sm mt-1">Create your first order to get started</p>
              <Link href="/dashboard/orders/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              </Link>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>{order.client_name}</TableCell>
                      <TableCell>{format(new Date(order.order_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{order.order_items?.length || 0}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "fulfilled" ? "success" : "default"}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
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
