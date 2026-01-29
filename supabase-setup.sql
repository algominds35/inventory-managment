-- ================================================
-- INVENTORY MANAGEMENT DATABASE SCHEMA
-- ================================================
-- This script creates all tables and Row Level Security policies
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- PROFILES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- ================================================
-- SKUS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS skus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sku_name TEXT NOT NULL,
    current_quantity INTEGER NOT NULL DEFAULT 0 CHECK (current_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 0 CHECK (low_stock_threshold >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_skus_user_id ON skus(user_id);
CREATE INDEX IF NOT EXISTS idx_skus_current_quantity ON skus(current_quantity);

-- RLS Policies for skus
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own SKUs"
    ON skus FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own SKUs"
    ON skus FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SKUs"
    ON skus FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own SKUs"
    ON skus FOR DELETE
    USING (auth.uid() = user_id);

-- ================================================
-- ORDERS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    order_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- RLS Policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
    ON orders FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own orders"
    ON orders FOR DELETE
    USING (auth.uid() = user_id);

-- ================================================
-- ORDER_ITEMS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sku_id UUID NOT NULL REFERENCES skus(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_per_unit DECIMAL(10, 2) NOT NULL CHECK (price_per_unit >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_sku_id ON order_items(sku_id);

-- RLS Policies for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view order items of own orders"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert order items for own orders"
    ON order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update order items of own orders"
    ON order_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete order items of own orders"
    ON order_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- ================================================
-- FUNCTIONS AND TRIGGERS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skus_updated_at
    BEFORE UPDATE ON skus
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SAMPLE DATA (Optional - for testing)
-- ================================================
-- Uncomment the following to insert sample data
-- Replace 'YOUR_USER_ID' with an actual user ID from auth.users

/*
-- Sample Profile
INSERT INTO profiles (user_id, company_name)
VALUES ('YOUR_USER_ID', 'Acme Distribution Inc.');

-- Sample SKUs
INSERT INTO skus (user_id, sku_name, current_quantity, low_stock_threshold)
VALUES 
    ('YOUR_USER_ID', 'WIDGET-001', 100, 20),
    ('YOUR_USER_ID', 'GADGET-002', 50, 10),
    ('YOUR_USER_ID', 'THING-003', 200, 50);

-- Sample Order
INSERT INTO orders (user_id, client_name, order_date, status)
VALUES ('YOUR_USER_ID', 'ABC Corp', CURRENT_DATE, 'pending')
RETURNING id;

-- Sample Order Items (use the order ID from above)
INSERT INTO order_items (order_id, sku_id, quantity, price_per_unit)
SELECT 
    'ORDER_ID_FROM_ABOVE',
    id,
    10,
    29.99
FROM skus
WHERE sku_name = 'WIDGET-001'
LIMIT 1;
*/
