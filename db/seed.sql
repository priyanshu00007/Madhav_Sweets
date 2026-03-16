-- AMBROSIA SUPREME - LOGISTICS & RIDER EXPANSION
-- This script expands the schema to support the Rider ecosystem, OTP verification, and granular tracking.

SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS ambrosia_db;
USE ambrosia_db;

-- 1. CLEANUP (DROP TABLES)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS order_statuses;
DROP TABLE IF EXISTS users;

-- 2. USER MANAGEMENT (Added 'rider' role)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    role ENUM('user', 'admin', 'rider') DEFAULT 'user',
    avatar_url VARCHAR(512),
    provider VARCHAR(50) DEFAULT 'credentials',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORY MANAGEMENT
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 4. PRODUCT MANAGEMENT
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    weight_unit ENUM('kg', 'g', 'pc') DEFAULT 'kg',
    weight_options VARCHAR(255) DEFAULT '250g, 500g, 1kg',
    image_url VARCHAR(512),
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INT DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    tags VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 5. ORDER STATUSES (Granular Logistics States)
CREATE TABLE order_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- 6. ORDERS (Integrated Logistics Columns)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    rider_id INT DEFAULT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status_id INT DEFAULT 1,
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    delivery_otp VARCHAR(6) DEFAULT NULL,
    feedback_rating INT DEFAULT NULL,
    feedback_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (rider_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES order_statuses(id) ON DELETE SET NULL
);

-- 7. ORDER ITEMS
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    weight_selected VARCHAR(50),
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- 8. INITIAL DATA SEED
INSERT INTO categories (id, name, description) VALUES 
(1, 'Classic', 'Timeless delights crafted with original recipes.'),
(2, 'Ghee Special', 'Rich sweets prepared in 100% pure desi ghee.'),
(3, 'Syrup Base', 'Soft and juicy dainties soaked in aromatic syrups.'),
(4, 'Signature', 'Ambrosia exclusive heritage creations.'),
(5, 'Signature Heritage', 'Legacy compositions from historical archives.');

INSERT INTO order_statuses (status_name) VALUES 
('Pending'),            -- 1
('Processing'),         -- 2
('Awaiting Rider'),     -- 3
('Partner Accepted'),   -- 4
('Picked Up'),          -- 5
('Near Location'),      -- 6
('Reached'),            -- 7
('Delivered'),          -- 8
('Cancelled');          -- 9

-- ADMIN (admin123)
INSERT INTO users (name, email, password_hash, role, avatar_url, provider) VALUES 
('Ambrosia Admin', 'admin@ambrosia.com', '$2a$10$8uebGxWIB5K7P6QhzatQ2.NyEVOQW/2ABe2i3Tf4.GKbIdcf7EG36', 'admin', '/images/users/admin_avatar.jpg', 'credentials');

-- RIDER (rider123)
INSERT INTO users (name, email, password_hash, role, avatar_url, provider) VALUES 
('Bullet Rider', 'rider@ambrosia.com', '$2a$10$8uebGxWIB5K7P6QhzatQ2.NyEVOQW/2ABe2i3Tf4.GKbIdcf7EG36', 'rider', '/images/users/rider_avatar.jpg', 'credentials');

-- PRODUCTS
INSERT INTO products (id, category_id, name, description, price, discount_price, weight_unit, weight_options, image_url, rating, review_count, stock_quantity, tags) VALUES 
(1, 1, 'Luxury Kaju Katli', 'Traditional diamond-shaped cashew fudge topped with pure silver varq. Made with 100% premium cashews. Slow-cooked to ensure a smooth, velvety texture that melts in your mouth.', 1200.00, 1400.00, 'kg', '250g, 500g, 1kg, 2kg', '/images/products/kaju_katli.jpg', 4.8, 124, 50, 'Best Seller, Pure Cashew, Festive'),
(2, 2, 'Pure Desi Ghee Besan Laddu', 'Gram flour roasted to perfection in aromatic desi ghee, infused with green cardamom and crunchy almonds. A timeless classic passed down through generations.', 850.00, 950.00, 'kg', '500g, 1kg, 5kg', '/images/products/besan_laddu.jpg', 4.9, 89, 30, 'Handmade, Pure Ghee'),
(3, 3, 'Saffron Infused Rasgulla', 'Soft, spongy cottage cheese balls soaked in a delicate saffron-flavored sugar syrup. Each bite releases a burst of floral sweetness.', 600.00, 750.00, 'pc', '6 Pcs, 12 Pcs, 24 Pcs', '/images/products/rasgulla.jpg', 4.7, 212, 100, 'Soft, Saffron'),
(4, 2, 'Motichoor Premium Laddu', 'Fine pearls of gram flour deep-fried in ghee and soaked in cardamom syrup. Perfectly round and incredibly flavorful.', 750.00, 800.00, 'kg', '500g, 1kg, 2kg', '/images/products/besan_laddu.jpg', 5.0, 450, 45, 'Customer Favorite'),
(5, 1, 'Premium Gulab Jamun', 'Classic milk-solid balls deep fried and soaked in rose water scented syrup. Soft, juicy, and perfect for every celebration.', 550.00, 650.00, 'kg', '500g, 1kg, 2.5kg', '/images/products/gulab_jamun.jpg', 4.9, 320, 80, 'Best Served Warm'),
(6, 4, 'Rose & Nut Barfi', 'Layered barfi with real rose petals and a blend of crushed pistachios and almonds. A modern twist on traditional barfi.', 1100.00, 1300.00, 'kg', '250g, 500g, 1kg', '/images/products/rose_barfi.jpg', 4.6, 67, 25, 'Gift Choice'),
(7, 3, 'Saffron Ghee Jalebi', 'Intricately swirled, crispy jalebis made with pure desi ghee and dunked in a rich saffron-infused syrup. Served hot and fresh.', 500.00, 600.00, 'kg', '250g, 500g, 1kg', '/images/products/jalebi.jpg', 4.9, 156, 40, 'Hot, Pure Ghee'),
(8, 5, 'Heritage Mysore Pak', 'The pride of South India. A porous, melt-in-the-mouth delicacy cooked with premium besan, sugar, and an abundance of aromatic desi ghee.', 900.00, 1050.00, 'kg', '500g, 1kg', '/images/products/Heritage_Mysore_Pak.jpg', 4.8, 92, 35, 'Signature Heritage Mysore, Saffron Ghee, Ghee Rich, Heritage'),
(9, 1, 'Classic Mathura Peda', 'Caramelized milk solids kneaded with cardamom and nutmeg. A traditional temple sweet with a rich, profound flavor and authentic texture.', 700.00, 800.00, 'kg', '250g, 500g, 1kg', '/images/products/Classic_Mathura_Peda.jpg', 4.7, 110, 60, 'Traditional, Milk Based');

SET FOREIGN_KEY_CHECKS = 1;