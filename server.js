const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'glorious_trade_hub'
};

let db;

async function initDatabase() {
  try {
    // First connect without database to create it if needed
    const tempConfig = { ...dbConfig };
    delete tempConfig.database;
    
    const tempDb = await mysql.createConnection(tempConfig);
    await tempDb.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempDb.end();
    
    // Now connect to the specific database
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
    // Create tables
    await createTables();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

async function createTables() {
  // Users table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      address TEXT,
      role ENUM('user', 'admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Categories table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock_quantity INT DEFAULT 0,
      category_id INT,
      images JSON,
      featured BOOLEAN DEFAULT FALSE,
      status ENUM('active', 'inactive') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Cart table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS cart (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_product (user_id, product_id)
    )
  `);

  // Orders table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
      shipping_address TEXT NOT NULL,
      payment_method VARCHAR(50),
      payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Order items table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Create cart_items table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_product (user_id, product_id)
    )
  `);

  console.log('Database tables created successfully');
}

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes

// Auth Routes
app.post('/api/auth/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, address } = req.body;

    // Check if user exists
    const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address]
    );

    const token = jwt.sign(
      { id: result.insertId, userId: result.insertId, email, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.insertId, name, email, role: 'user' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Product Routes
// Contact form route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // In a real app, you'd save this to database and/or send email
    console.log('Contact form submission:', { name, email, subject, message });
    
    // For now, just return success
    res.json({ 
      success: true, 
      message: 'Thank you for your message! We\'ll get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? AND p.status = 'active'
    `, [id]);
    
    if (!products[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 12 } = req.query;
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.status = 'active'
    `;
    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(parseInt(category));
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (featured === 'true') {
      query += ' AND p.featured = 1';
    }

    query += ' ORDER BY p.created_at DESC';

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const offset = (pageNum - 1) * limitNum;
    
    // Use string interpolation for LIMIT and OFFSET to avoid parameter binding issues
    query += ` LIMIT ${limitNum} OFFSET ${offset}`;

    const [products] = await db.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE p.status = "active"';
    const countParams = [];

    if (category) {
      countQuery += ' AND p.category_id = ?';
      countParams.push(parseInt(category));
    }

    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (featured === 'true') {
      countQuery += ' AND p.featured = 1';
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const totalProducts = countResult[0].total;

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalProducts,
        pages: Math.ceil(totalProducts / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? AND p.status = 'active'
    `, [parseInt(req.params.id)]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Categories Routes
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cart Routes
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const [cartItems] = await db.execute(`
      SELECT c.*, p.name, p.price, p.images, p.stock_quantity
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.userId]);

    res.json(cartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Check if product exists and has stock
    const [products] = await db.execute('SELECT * FROM products WHERE id = ? AND status = "active"', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Add or update cart item
    await db.execute(`
      INSERT INTO cart (user_id, product_id, quantity) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `, [req.user.userId, product_id, quantity]);

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      await db.execute('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
    } else {
      await db.execute('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.userId]);
    }

    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    await db.execute('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Orders Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { shipping_address, payment_method } = req.body;

    // Get cart items
    const [cartItems] = await db.execute(`
      SELECT c.*, p.name, p.price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.userId]);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const [orderResult] = await db.execute(
      'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
      [req.user.userId, total, shipping_address, payment_method]
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of cartItems) {
      await db.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Update product stock
      await db.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.userId]);

    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    // Get orders first
    const [orders] = await db.execute(`
      SELECT o.*
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.userId]);

    // Get order items for each order
    const ordersWithItems = [];
    for (const order of orders) {
      const [items] = await db.execute(`
        SELECT oi.*, p.name as product_name
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      
      ordersWithItems.push({
        ...order,
        items: items
      });
    }

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Routes
app.post('/api/admin/products', authenticateToken, requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id, featured } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, stock_quantity, category_id, images, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, stock_quantity, category_id, JSON.stringify(images), featured === 'true']
    );

    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/admin/categories', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const [result] = await db.execute(
      'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)',
      [name, description, image]
    );

    res.status(201).json({ message: 'Category created successfully', categoryId: result.insertId });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Handle both 'id' and 'userId' in token payload for compatibility
    const userId = decoded.id || decoded.userId;
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (!rows[0] || rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin Routes
// Get admin dashboard stats
app.get('/api/admin/stats', isAdmin, async (req, res) => {
  try {
    const [usersResult] = await db.execute('SELECT COUNT(*) as total FROM users');
    const totalUsers = usersResult[0].total;
    
    const [productsResult] = await db.execute('SELECT COUNT(*) as total FROM products');
    const totalProducts = productsResult[0].total;
    
    const [ordersResult] = await db.execute('SELECT COUNT(*) as total FROM orders');
    const totalOrders = ordersResult[0].total;
    
    const [revenueResult] = await db.execute('SELECT SUM(total_amount) as revenue FROM orders WHERE status != "cancelled"');
    const totalRevenue = revenueResult[0].revenue || 0;
    
    const [recentOrders] = await db.execute(`
      SELECT o.*, u.name as user_name 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC 
      LIMIT 5
    `);
    
    const [lowStockProducts] = await db.execute(`
      SELECT * FROM products 
      WHERE stock_quantity < 10 AND status = 'active' 
      ORDER BY stock_quantity ASC 
      LIMIT 5
    `);
    
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get all users
app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT id, name, email, role, created_at FROM users';
    const params = [];
    
    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    
    const [users] = await db.execute(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    if (search) {
      countQuery += ' WHERE name LIKE ? OR email LIKE ?';
    }
    const [countResult] = await db.execute(countQuery, search ? [`%${search}%`, `%${search}%`] : []);
    
    res.json({
      users,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
app.put('/api/admin/users/:id/role', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete user
app.delete('/api/admin/users/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get all products for admin
app.get('/api/admin/products', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const params = [];
    const conditions = [];
    
    if (search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (category) {
      conditions.push('p.category_id = ?');
      params.push(category);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    
    const [products] = await db.execute(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM products p';
    let countParams = [];
    
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
      // Build count params separately to avoid LIMIT/OFFSET issues
      if (search) {
        countParams.push(`%${search}%`, `%${search}%`);
      }
      if (category) {
        countParams.push(category);
      }
    }
    
    const [countResult] = await db.execute(countQuery, countParams);
    
    res.json({
      products,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product
app.post('/api/admin/products', isAdmin, async (req, res) => {
  try {
    const { name, description, price, category_id, stock_quantity, status = 'active', images } = req.body;
    
    if (!name || !description || !price || !category_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Ensure images is a valid JSON array
    const imageData = images && Array.isArray(images) ? JSON.stringify(images) : JSON.stringify([]);
    
    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, category_id, stock_quantity, status, images) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, parseFloat(price), parseInt(category_id), parseInt(stock_quantity) || 0, status, imageData]
    );
    
    res.json({ message: 'Product created successfully', productId: result.insertId });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
app.put('/api/admin/products/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, stock_quantity, status, images } = req.body;
    
    // Ensure images is a valid JSON array
    const imageData = images && Array.isArray(images) ? JSON.stringify(images) : JSON.stringify([]);
    
    const [result] = await db.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, stock_quantity = ?, status = ?, images = ? WHERE id = ?',
      [name, description, parseFloat(price), parseInt(category_id), parseInt(stock_quantity), status, imageData, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/admin/products/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get all orders
app.get('/api/admin/orders', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
    }
    
    if (search) {
      conditions.push('(u.name LIKE ? OR u.email LIKE ? OR o.id LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY o.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    
    const [orders] = await db.execute(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM orders o LEFT JOIN users u ON o.user_id = u.id';
    let countParams = [];
    
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
      // Build count params separately
      if (status) {
        countParams.push(status);
      }
      if (search) {
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
    }
    
    const [countResult] = await db.execute(countQuery, countParams);
    
    res.json({
      orders,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
app.put('/api/admin/orders/:id/status', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const [result] = await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Check current user role (for debugging)
app.get('/api/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId;
    const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
    
    if (!rows[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: rows[0], tokenPayload: decoded });
  } catch (error) {
    console.error('Me route error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Cart Routes
// Get user's cart items
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [cartItems] = await db.execute(`
      SELECT c.*, p.name, p.price, p.image_url, p.stock_quantity 
      FROM cart_items c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?
    `, [userId]);
    
    res.json(cartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add item to cart
app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists and has enough stock
    const [product] = await db.execute('SELECT * FROM products WHERE id = ? AND status = "active"', [product_id]);
    if (!product[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product[0].stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Check if item already exists in cart
    const [existingItem] = await db.execute(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingItem[0]) {
      // Update quantity
      const newQuantity = existingItem[0].quantity + parseInt(quantity);
      if (newQuantity > product[0].stock_quantity) {
        return res.status(400).json({ error: 'Insufficient stock for requested quantity' });
      }
      
      await db.execute(
        'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [newQuantity, userId, product_id]
      );
    } else {
      // Add new item
      await db.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, product_id, quantity]
      );
    }

    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
app.put('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    // Check if cart item belongs to user
    const [cartItem] = await db.execute(
      'SELECT c.*, p.stock_quantity FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.id = ? AND c.user_id = ?',
      [id, userId]
    );

    if (!cartItem[0]) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity > cartItem[0].stock_quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await db.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, id]);
    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await db.execute('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear entire cart
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await db.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure multer for image uploads (AI analysis - memory storage)
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Configure multer for product image storage (disk storage)
const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'public/uploads/products/';
    
    // Ensure directory exists
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + extension);
  }
});

const productImageUpload = multer({
  storage: productImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for product images
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// AI Product Analysis Route
app.post('/api/admin/ai/analyze-product', isAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
      return res.status(500).json({ 
        success: false, 
        error: 'Gemini API key not configured. Please add your API key to .env file' 
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Analyze this product image and extract the following information in JSON format:
      {
        "name": "Product name (be descriptive and specific)",
        "description": "Detailed product description (2-3 sentences)",
        "category": "Product category (e.g., Electronics, Clothing, Food, Home & Garden, Sports, Books, etc.)",
        "estimatedPrice": "Estimated price in USD (number only, no currency symbol)",
        "features": ["feature1", "feature2", "feature3"],
        "tags": ["tag1", "tag2", "tag3"],
        "color": "Primary color if visible",
        "brand": "Brand name if visible",
        "condition": "new/used/refurbished",
        "extractedText": "Any text visible in the image"
      }

      Guidelines:
      - Be specific and accurate in product naming
      - Provide realistic price estimates based on what you see
      - Create meaningful categories that could be used in an e-commerce store
      - Extract all visible text accurately
      - If information is not clearly visible, use "Unknown" or reasonable estimates
      - Make the description marketing-friendly and appealing
      - Only return valid JSON, no additional text
    `;

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const productData = JSON.parse(jsonMatch[0]);
        
        // Validate and clean the data
        const cleanedData = {
          name: productData.name || 'Unknown Product',
          description: productData.description || 'No description available',
          category: productData.category || 'General',
          estimatedPrice: parseFloat(productData.estimatedPrice) || 0,
          features: Array.isArray(productData.features) ? productData.features : [],
          tags: Array.isArray(productData.tags) ? productData.tags : [],
          color: productData.color || 'Unknown',
          brand: productData.brand || 'Unknown',
          condition: productData.condition || 'new',
          extractedText: productData.extractedText || ''
        };

        res.json({
          success: true,
          data: cleanedData
        });
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        res.status(500).json({
          success: false,
          error: 'Failed to parse AI response'
        });
      }
    } else {
      console.error('No JSON found in AI response:', text);
      res.status(500).json({
        success: false,
        error: 'AI did not return valid product data'
      });
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze image'
    });
  }
});

// Bulk AI Product Analysis Route
app.post('/api/admin/ai/analyze-bulk-products', isAdmin, imageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
      return res.status(500).json({ 
        success: false, 
        error: 'Gemini API key not configured. Please add your API key to .env file' 
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Analyze this image and identify ALL products visible in it. For each product found, extract the following information in JSON format:
      {
        "products": [
          {
            "name": "Product name (be descriptive and specific)",
            "description": "Detailed product description (2-3 sentences)",
            "category": "Product category (e.g., Electronics, Clothing, Food, Home & Garden, Sports, Books, etc.)",
            "estimatedPrice": "Estimated price in USD (number only, no currency symbol)",
            "features": ["feature1", "feature2", "feature3"],
            "tags": ["tag1", "tag2", "tag3"],
            "color": "Primary color if visible",
            "brand": "Brand name if visible",
            "condition": "new/used/refurbished",
            "extractedText": "Any text visible for this product"
          }
        ]
      }

      Guidelines:
      - Identify ALL separate products in the image, even if they're similar
      - Be specific and accurate in product naming
      - Provide realistic price estimates based on what you see
      - Create meaningful categories that could be used in an e-commerce store
      - Extract all visible text accurately for each product
      - If information is not clearly visible, use "Unknown" or reasonable estimates
      - Make descriptions marketing-friendly and appealing
      - If you see multiple of the same item, list them as separate products
      - Look carefully for different products, brands, models, or variations
      - Only return valid JSON, no additional text
    `;

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const bulkData = JSON.parse(jsonMatch[0]);
        
        // Validate and clean the data
        const cleanedData = {
          products: []
        };

        if (bulkData.products && Array.isArray(bulkData.products)) {
          cleanedData.products = bulkData.products.map(product => ({
            name: product.name || 'Unknown Product',
            description: product.description || 'No description available',
            category: product.category || 'General',
            estimatedPrice: parseFloat(product.estimatedPrice) || 0,
            features: Array.isArray(product.features) ? product.features : [],
            tags: Array.isArray(product.tags) ? product.tags : [],
            color: product.color || 'Unknown',
            brand: product.brand || 'Unknown',
            condition: product.condition || 'new',
            extractedText: product.extractedText || ''
          }));
        }

        res.json({
          success: true,
          data: cleanedData
        });
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        res.status(500).json({
          success: false,
          error: 'Failed to parse AI response'
        });
      }
    } else {
      console.error('No JSON found in AI response:', text);
      res.status(500).json({
        success: false,
        error: 'AI did not return valid product data'
      });
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze image'
    });
  }
});

// Image upload endpoint for products
app.post('/api/admin/upload-product-image', isAdmin, productImageUpload.single('image'), async (req, res) => {
  try {
    console.log('Upload request received:', req.file ? 'File present' : 'No file');
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    console.log('File details:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    const imageUrl = `/uploads/products/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Image upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload image'
    });
  }
});

// Delete product image endpoint
app.delete('/api/admin/delete-product-image/:filename', isAdmin, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public/uploads/products', filename);
    
    // Check if file exists and delete it
    const fs = require('fs').promises;
    try {
      await fs.unlink(filePath);
      res.json({ success: true, message: 'Image deleted successfully' });
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.json({ success: true, message: 'Image not found (already deleted)' });
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete image'
    });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' });
    }
  }
  console.error(error);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
