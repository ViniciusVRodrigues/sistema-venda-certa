-- Sistema Venda Certa Database Schema
-- This script defines the complete database structure for the e-commerce system

-- Users table (base table for customers, admins, and delivery personnel)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('admin', 'customer', 'delivery') NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers table (extends users for customer-specific data)
CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    is_vip BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    last_order_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admins table (extends users for admin-specific data)
CREATE TABLE admins (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    permissions TEXT, -- JSON array of permissions
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Delivery personnel table (extends users for delivery-specific data)
CREATE TABLE delivery_personnel (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    vehicle VARCHAR(100),
    completed_deliveries INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Addresses table
CREATE TABLE addresses (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    customer_id INTEGER NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Categories table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    category_id INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10) NOT NULL DEFAULT 'un',
    stock INTEGER NOT NULL DEFAULT 0,
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    images TEXT, -- JSON array of image URLs
    tags TEXT, -- JSON array of tags
    sku VARCHAR(100) UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Product variations table
CREATE TABLE product_variations (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    product_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    weight DECIMAL(8,3),
    length DECIMAL(8,2),
    width DECIMAL(8,2),
    height DECIMAL(8,2),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Delivery methods table
CREATE TABLE delivery_methods (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('pickup', 'delivery', 'fixed_shipping') NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estimated_days INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Delivery regions table
CREATE TABLE delivery_regions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    delivery_method_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    zip_code_start VARCHAR(10) NOT NULL,
    zip_code_end VARCHAR(10) NOT NULL,
    neighborhoods TEXT, -- JSON array of neighborhoods
    fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estimated_days INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (delivery_method_id) REFERENCES delivery_methods(id) ON DELETE CASCADE
);

-- Delivery schedules table
CREATE TABLE delivery_schedules (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    delivery_method_id INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL, -- 0-6, 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (delivery_method_id) REFERENCES delivery_methods(id) ON DELETE CASCADE
);

-- Payment methods table
CREATE TABLE payment_methods (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('credit_card', 'debit_card', 'pix', 'bank_transfer', 'cash') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    config TEXT, -- JSON configuration for payment method
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    customer_id INTEGER NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('received', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'received',
    delivery_address_id INTEGER NOT NULL,
    delivery_method_id INTEGER NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method_id INTEGER NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    estimated_delivery_date DATETIME,
    delivered_at DATETIME,
    notes TEXT,
    cancel_reason TEXT,
    delivery_driver_id INTEGER,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (delivery_address_id) REFERENCES addresses(id),
    FOREIGN KEY (delivery_method_id) REFERENCES delivery_methods(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    FOREIGN KEY (delivery_driver_id) REFERENCES delivery_personnel(id)
);

-- Order items table
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_variation_id INTEGER,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (product_variation_id) REFERENCES product_variations(id)
);

-- Order timeline events table
CREATE TABLE order_timeline_events (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    order_id INTEGER NOT NULL,
    status ENUM('received', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT NOT NULL,
    user_id INTEGER,
    user_name VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reviews table
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    product_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notification records table (for admin notifications management)
CREATE TABLE notification_records (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    type ENUM('order_created', 'status_updated', 'payment_confirmed', 'order_delivered') NOT NULL,
    order_id INTEGER,
    customer_id INTEGER NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivery_status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_addresses_customer_id ON addresses(customer_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_product_variations_product_id ON product_variations(product_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_timeline_events_order_id ON order_timeline_events(order_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);