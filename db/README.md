# MySQL Database Documentation - Ambrosia Sweets

This document provides instructions on how to set up and manage the MySQL database for the Ambrosia Sweets e-commerce platform.

## 1. Setup Instructions

### Prerequisites
- MySQL Server installed (v8.0 or higher recommended)
- MySQL Workbench or any SQL client (optional but helpful)

### Database Configuration
1. Create a new database:
   ```sql
   CREATE DATABASE ambrosia_db;
   ```
2. Run the schema script located at `db/schema.sql` to create all tables:
   ```bash
   mysql -u your_username -p ambrosia_db < db/schema.sql
   ```

## 2. Table Overview

### User Management
- `users`: Core user account data (email, password hash, OTP info).
- `addresses`: Stores multiple addresses for users with a "default" flag.
- `auth_tokens`: Session/Auth tokens for secure login.

### Product & Inventory
- `categories`: Product classifications (e.g., Traditional, Premium, Seasonal).
- `products`: Product details, pricing, and average ratings.
- `product_images`: Multiple images per product.
- `inventory`: Tracks stock counts and low-stock alerts.

### Sales & Orders
- `carts` & `cart_items`: Pending shopping carts.
- `orders` & `order_items`: Permanent record of purchases.
- `order_statuses`: Lookup table for order progress (Pending, Shipped, etc.).
- `transactions`: Payment gateway logs (Razorpay/Stripe/PayPal integration).

### Social
- `reviews`: Star ratings and comments from customers.

## 3. Connecting to Frontend (Next.js)

To connect the Next.js app to MySQL, we use the `mysql2` driver.

### Environment Variables
Add these to your `.env.local` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ambrosia_db
```

### Database Utility
The connection pool is managed in `lib/db.ts` to ensure efficient connection usage.

## 4. Useful SQL Queries

### Search Products by Keyword
```sql
SELECT * FROM products 
WHERE name LIKE '%Kesar%' OR description LIKE '%Kesar%';
```

### Filter by Category and Price
```sql
SELECT p.* FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.name = 'Premium' AND p.price BETWEEN 400 AND 600;
```

### Sort by Popularity (Review Count)
```sql
SELECT * FROM products ORDER BY review_count DESC;
```
