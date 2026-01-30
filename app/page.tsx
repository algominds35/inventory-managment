import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Package, AlertTriangle, TrendingDown, ShoppingCart, Users, BarChart, Lock } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">InventoryPro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge className="bg-blue-50 text-blue-600 border-blue-200">
              Trusted by 100+ distributors
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Stop Overselling.<br />Start Growing.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The inventory management system built for small distributors. 
              Automatically track stock, prevent overselling, and say goodbye to spreadsheets forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tired of These Problems?
            </h2>
            <p className="text-lg text-gray-600">
              If you're using spreadsheets, you know the pain...
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle className="text-red-900">Overselling</CardTitle>
                <CardDescription className="text-red-700">
                  Selling products you don't have costs you money and damages customer trust
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader>
                <TrendingDown className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle className="text-yellow-900">Lost Sales</CardTitle>
                <CardDescription className="text-yellow-700">
                  Running out of stock means missing sales opportunities and disappointed customers
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-300 bg-gray-50">
              <CardHeader>
                <Package className="h-10 w-10 text-gray-600 mb-2" />
                <CardTitle className="text-gray-900">Manual Tracking</CardTitle>
                <CardDescription className="text-gray-700">
                  Updating spreadsheets after every order is time-consuming and error-prone
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Inventory
            </h2>
            <p className="text-lg text-gray-600">
              Built specifically for distributors handling 30-300 orders per week
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <ShoppingCart className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Automatic Inventory Deduction</CardTitle>
                <CardDescription>
                  Create an order and inventory updates automatically. No more manual spreadsheet updates.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Overselling Prevention</CardTitle>
                <CardDescription>
                  Get instant warnings when ordering more than available stock. Protect your reputation.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Package className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>
                  Never run out of your best sellers. Get alerted when items hit your threshold.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BarChart className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Real-Time Dashboard</CardTitle>
                <CardDescription>
                  See your total SKUs, orders, and stock levels at a glance. Make informed decisions fast.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Multi-Tenant Secure</CardTitle>
                <CardDescription>
                  Your data is completely isolated and secure. Enterprise-grade security for everyone.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Lock className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>CSV Export</CardTitle>
                <CardDescription>
                  Export your inventory and orders anytime. Perfect for accounting and compliance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in minutes, not days
            </p>
          </div>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Your SKUs</h3>
                <p className="text-gray-600">
                  Import your products with quantities and low-stock thresholds. Takes 5 minutes.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Orders</h3>
                <p className="text-gray-600">
                  Enter customer orders through our simple interface. Select products and quantities.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Watch the Magic</h3>
                <p className="text-gray-600">
                  Inventory automatically updates. Low stock alerts appear. No more manual work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              No hidden fees. Cancel anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="mt-2">
                  Perfect for getting started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Up to 200 SKUs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Unlimited orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>CSV export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full mt-6" variant="outline">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-600 border-2 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="mt-2">
                  For growing distributors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Up to 500 SKUs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Unlimited orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>CSV export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Advanced reporting</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full mt-6">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription className="mt-2">
                  For large operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Unlimited SKUs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Unlimited orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Multi-user access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>24/7 phone support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full mt-6" variant="outline">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Stop Overselling?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of distributors who have eliminated spreadsheet chaos
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
              Start Your Free Trial Today
            </Button>
          </Link>
          <p className="text-blue-100 mt-4">
            14-day free trial • No credit card required • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">InventoryPro</span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2026 InventoryPro. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link href="/signup" className="text-gray-600 hover:text-gray-900">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
