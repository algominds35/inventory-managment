# B2B SaaS Inventory Management System

A complete order and inventory management web application for small distributors. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Authentication**: Secure signup/login with email and password
- **Inventory Management**: Add, edit, delete SKUs with quantity tracking
- **Order Management**: Create orders with automatic inventory deduction
- **Low Stock Alerts**: Real-time alerts when inventory falls below threshold
- **Overselling Prevention**: Warnings when ordering more than available stock
- **Dashboard**: Overview of SKUs, orders, and stock levels
- **Multi-tenancy**: Row-level security ensures users only see their own data
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui (built on Radix UI)
- **Backend**: Supabase (PostgreSQL, Authentication, Row Level Security)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 1. Clone and Install

```bash
cd inventory
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your project URL and anon key
3. Go to SQL Editor and run the contents of `supabase-setup.sql`

### 3. Configure Environment Variables

Create a `.env.local` file (already created) and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Database Schema

### Tables

#### `profiles`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `company_name` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `skus`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `sku_name` (Text)
- `current_quantity` (Integer)
- `low_stock_threshold` (Integer)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `orders`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `client_name` (Text)
- `order_date` (Date)
- `status` (Text: pending, fulfilled, cancelled)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `order_items`
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key to orders)
- `sku_id` (UUID, Foreign Key to skus)
- `quantity` (Integer)
- `price_per_unit` (Decimal)
- `created_at` (Timestamp)

## Key Features Explained

### Automatic Inventory Deduction

When an order is created, the system:
1. Creates the order record
2. Creates order_items records
3. **Automatically deducts quantities from SKUs**
4. Shows success notification

### Overselling Prevention

When creating an order:
- The system checks if ordered quantity > available quantity
- Shows a warning message for each item
- Allows user to proceed (or cancel) with acknowledgment
- Prevents negative inventory (uses `Math.max(0, quantity)`)

### Low Stock Alerts

- Dashboard shows SKUs where `current_quantity <= low_stock_threshold`
- Color-coded badges (Green: In Stock, Yellow: Low Stock, Red: Out of Stock)
- Real-time updates

### Row Level Security

All database queries are automatically filtered by `user_id`:
- Users can only see their own SKUs, orders, and data
- Enforced at the database level for security
- No need for manual filtering in application code

## Project Structure

```
inventory/
├── app/
│   ├── dashboard/
│   │   ├── inventory/       # Inventory management page
│   │   ├── orders/          # Orders list and detail pages
│   │   │   ├── new/         # Create order page
│   │   │   └── [id]/        # Order detail page
│   │   ├── settings/        # Settings page
│   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   └── page.tsx         # Dashboard home
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Redirect to login
├── components/
│   └── ui/                  # Shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Supabase client
│   │   ├── server.ts        # Supabase server client
│   │   └── database.types.ts # TypeScript types
│   └── utils.ts             # Utility functions
├── hooks/
│   └── use-toast.ts         # Toast notification hook
├── middleware.ts            # Auth middleware
├── supabase-setup.sql       # Database setup script
└── .env.local               # Environment variables
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Pricing Model

This application is designed for small distributors with:
- 30-300 orders per week
- 200-500 SKUs
- Target price: $99-199/month

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT License - feel free to use this for commercial projects!
