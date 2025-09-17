-- Sample data for Glorious Trade Hub
-- Run this after your database is created

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Latest electronic devices and gadgets'),
('Clothing', 'Fashion and apparel for all ages'),
('Home & Garden', 'Home improvement and garden supplies'),
('Sports & Outdoors', 'Sports equipment and outdoor gear'),
('Books & Media', 'Books, movies, and educational materials'),
('Health & Beauty', 'Personal care and beauty products');

-- Insert sample products
INSERT INTO products (name, description, price, stock_quantity, category_id, featured) VALUES
('Smartphone Pro Max', 'Latest flagship smartphone with advanced features', 999.99, 50, 1, TRUE),
('Wireless Headphones', 'Premium noise-canceling wireless headphones', 299.99, 75, 1, TRUE),
('Designer T-Shirt', 'Premium cotton t-shirt with modern design', 49.99, 100, 2, FALSE),
('Running Shoes', 'Professional running shoes for athletes', 149.99, 60, 4, TRUE),
('Coffee Maker', 'Automatic coffee maker with programmable settings', 199.99, 30, 3, FALSE),
('Fitness Tracker', 'Advanced fitness tracker with heart rate monitor', 179.99, 80, 4, TRUE),
('Organic Face Cream', 'Natural anti-aging face cream', 79.99, 40, 6, FALSE),
('Programming Book', 'Complete guide to modern web development', 59.99, 25, 5, FALSE),
('Yoga Mat', 'Non-slip premium yoga mat', 39.99, 90, 4, FALSE),
('Bluetooth Speaker', 'Portable waterproof bluetooth speaker', 89.99, 65, 1, TRUE);

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@glorioustradehub.com', '$2a$10$8K1p/a0dLN7Hvf4m.WTWDekcb9H0wt0sQlDr9a25s2sg2.YTdHWrW', 'admin');

-- Insert sample regular user (password: user123)
INSERT INTO users (name, email, password, phone, address) VALUES
('John Doe', 'user@example.com', '$2a$10$8K1p/a0dLN7Hvf4m.WTWDekcb9H0wt0sQlDr9a25s2sg2.YTdHWrW', '+1234567890', '123 Main St, City, State 12345');
