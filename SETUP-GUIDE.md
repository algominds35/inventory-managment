# Complete Setup Guide

Follow these steps to get your inventory management system up and running.

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in the details:
   - **Name**: Inventory Management
   - **Database Password**: (choose a strong password and save it)
   - **Region**: (choose closest to you)
4. Click "Create new project"
5. Wait for the project to be ready (1-2 minutes)

### 1.2 Get Your API Keys

1. Go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 1.3 Set Up the Database

1. Go to **SQL Editor** in the left sidebar
2. Click "+ New Query"
3. Open the `supabase-setup.sql` file from this project
4. Copy ALL the contents and paste into the SQL Editor
5. Click "Run" (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned" - this is good!

### 1.4 Verify Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - profiles
   - skus
   - orders
   - order_items

## Step 2: Configure Your Application

### 2.1 Update Environment Variables

1. Open the `.env.local` file in the project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 3: Install Dependencies and Run

### 3.1 Install Dependencies

```bash
npm install
```

### 3.2 Run the Development Server

```bash
npm run dev
```

### 3.3 Open the Application

Open your browser and go to: [http://localhost:3000](http://localhost:3000)

## Step 4: Test the Application

### 4.1 Create an Account

1. You should be redirected to the login page
2. Click "Sign up"
3. Fill in:
   - **Company Name**: Test Company
   - **Email**: test@example.com
   - **Password**: password123
4. Click "Create Account"

### 4.2 Add Some SKUs

1. You should now be on the Dashboard
2. Click "Inventory" in the sidebar
3. Click "Add New SKU"
4. Add your first SKU:
   - **SKU Name**: WIDGET-001
   - **Current Quantity**: 100
   - **Low Stock Threshold**: 20
5. Click "Add SKU"
6. Add a few more SKUs for testing

### 4.3 Create an Order

1. Click "Orders" in the sidebar
2. Click "Create Order"
3. Fill in the form:
   - **Client Name**: ABC Corporation
   - **Order Date**: (today's date)
   - **Line Items**:
     - Select a SKU
     - Enter quantity: 10
     - Enter price: 29.99
4. Click "Create Order"

### 4.4 Verify Inventory Deduction

1. Go back to "Inventory"
2. Check that the quantity was deducted from the SKU you ordered
3. If you ordered 10 units from a SKU with 100, it should now show 90

### 4.5 Test Overselling Warning

1. Create another order
2. Try to order MORE than the available quantity
3. You should see a yellow warning box
4. The system will ask for confirmation before proceeding

## Step 5: Production Deployment

### 5.1 Prepare for Production

1. Make sure all your code is committed to Git
2. Push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### 5.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add `NEXT_PUBLIC_SUPABASE_URL` and your URL
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` and your key
6. Click "Deploy"
7. Wait for deployment to complete (1-2 minutes)

### 5.3 Test Production Deployment

1. Visit your new production URL (Vercel will provide this)
2. Test signup, login, and key features
3. Make sure everything works as expected

## Troubleshooting

### Issue: "Invalid login credentials"

**Solution**: Make sure you're using the correct email and password. Passwords must be at least 6 characters.

### Issue: "Failed to load SKUs/Orders"

**Solution**: 
1. Check that your `.env.local` file has the correct Supabase credentials
2. Make sure you ran the `supabase-setup.sql` script in Supabase
3. Restart your dev server (`npm run dev`)

### Issue: RLS Policy Errors

**Solution**: Make sure all the RLS policies were created by running the complete `supabase-setup.sql` script.

### Issue: Cannot create orders

**Solution**: 
1. Make sure you have at least one SKU created
2. Check that you're logged in
3. Check browser console for errors

### Issue: Inventory not deducting

**Solution**: Check that the RLS policies for the `skus` table allow updates. Re-run the `supabase-setup.sql` script if needed.

## Next Steps

### Customize the Application

1. **Change Branding**: Update the logo, colors, and company name
2. **Add Features**: Add more fields to SKUs (cost, supplier, etc.)
3. **Email Notifications**: Set up email alerts for low stock
4. **Reporting**: Add reports and analytics
5. **Integrations**: Connect to QuickBooks, Stripe, etc.

### Production Considerations

1. **Backups**: Set up automated database backups in Supabase
2. **Monitoring**: Set up error tracking (Sentry, LogRocket)
3. **Analytics**: Add Google Analytics or similar
4. **Custom Domain**: Add your own domain in Vercel
5. **SSL**: Vercel provides SSL automatically

## Support

If you run into any issues:

1. Check the browser console for errors
2. Check Supabase logs (in Supabase dashboard)
3. Review this guide again
4. Check the main README.md for additional information

Good luck with your inventory management system! 🚀
