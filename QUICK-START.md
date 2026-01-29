# Quick Start Guide

Get your inventory management system running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)

## Step 1: Set Up Supabase (2 minutes)

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name it "Inventory Management"
   - Choose a database password
   - Click "Create new project"

2. **Get API Keys**
   - Go to Project Settings > API
   - Copy your **Project URL** and **anon public key**

3. **Create Database**
   - Go to SQL Editor
   - Click "New Query"
   - Copy and paste ALL contents from `supabase-setup.sql`
   - Click "Run"

## Step 2: Configure Application (1 minute)

1. **Update Environment Variables**
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Step 3: Run the App (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 4: Test It Out (1 minute)

1. **Sign Up**
   - Click "Sign up"
   - Enter company name, email, password
   - You're in!

2. **Add a SKU**
   - Go to Inventory
   - Click "Add New SKU"
   - Name: TEST-001
   - Quantity: 100
   - Threshold: 20
   - Save

3. **Create an Order**
   - Go to Orders
   - Click "Create Order"
   - Client: Test Client
   - Add line item with your SKU
   - Quantity: 10
   - Price: 29.99
   - Create Order

4. **Check Inventory**
   - Go back to Inventory
   - Your SKU should now show 90 units (100 - 10)
   - ✅ Automatic inventory deduction working!

## What You Just Built

A production-ready B2B SaaS application with:

- ✅ User authentication and signup
- ✅ Multi-tenant data isolation (RLS)
- ✅ Inventory management with CRUD operations
- ✅ Order creation with automatic inventory deduction
- ✅ Low stock alerts
- ✅ Overselling prevention warnings
- ✅ Responsive mobile design
- ✅ Dashboard with real-time stats
- ✅ Professional UI with Tailwind CSS

## Next Steps

### Customize
- Change colors in `tailwind.config.ts`
- Update branding in dashboard layout
- Add your logo

### Deploy to Production
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Deploy to Vercel
# 1. Go to vercel.com
# 2. Import your repo
# 3. Add environment variables
# 4. Deploy!
```

### Add Features
- Export to CSV
- Email notifications
- Barcode scanning
- Multi-warehouse support
- Customer portal

## Troubleshooting

**Can't login?**
- Check `.env.local` has correct Supabase credentials
- Restart dev server

**No tables in Supabase?**
- Run the `supabase-setup.sql` script again

**Inventory not deducting?**
- Check browser console for errors
- Verify RLS policies in Supabase

## Need Help?

- Check `SETUP-GUIDE.md` for detailed instructions
- Check `README.md` for technical details
- Review code comments in the source files

## Ready for Customers?

This app is designed for small distributors paying $99-199/month. Features include:

- Handle 30-300 orders per week
- Manage 200-500 SKUs
- Prevent overselling
- Low stock alerts
- Multi-user support (coming soon)

Start selling! 🚀
