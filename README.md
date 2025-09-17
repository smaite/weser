# Glorious Trade Hub

A modern, full-stack e-commerce platform built with Node.js, React, and MySQL. Designed for easy deployment on cPanel hosting.

## Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **User Authentication**: Secure registration and login system
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add, remove, and manage cart items
- **Order Processing**: Complete checkout and order management
- **Admin Panel**: Manage products, categories, and orders
- **Mobile Responsive**: Works perfectly on all devices
- **Security**: Built-in security features and best practices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** authentication
- **bcrypt** for password hashing
- **Multer** for file uploads
- **Helmet** for security headers
- **Rate limiting** for API protection

### Frontend
- **React 18** with hooks
- **React Router** for navigation
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **Axios** for API calls
- **React Hot Toast** for notifications

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd glorious-trade-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database and configuration details.

4. **Build the frontend**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```

## Development

For development mode:
```bash
npm run dev
```

This will start the Node.js server with nodemon for auto-restart on changes.

## cPanel Deployment

1. **Upload files**: Upload all files to your cPanel public_html directory
2. **Database setup**: Create a MySQL database and user in cPanel
3. **Environment configuration**: Update `.env` with your cPanel database credentials
4. **Install dependencies**: Run `npm install` via SSH or cPanel terminal
5. **Build frontend**: Run `npm run build`
6. **Start application**: The app will run automatically with the provided configuration

### cPanel Configuration

Make sure your `.env` file contains:
```
DB_HOST=your_cpanel_db_host
DB_USER=your_cpanel_db_user
DB_PASSWORD=your_cpanel_db_password
DB_NAME=your_cpanel_db_name
CLIENT_URL=https://weser.glorioustradehub.com
NODE_ENV=production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/admin/products` - Create product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/admin/categories` - Create category (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

## Project Structure

```
glorious-trade-hub/
├── src/                    # React source files
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── uploads/               # File upload directory
├── public/                # Built React files (generated)
├── server.js              # Node.js/Express server
├── webpack.config.js      # Webpack configuration
├── package.json           # Dependencies and scripts
├── .htaccess             # Apache configuration for cPanel
└── README.md             # This file
```

## Default Admin Account

For testing purposes, you can create an admin account by registering and then manually updating the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection protection
- XSS protection headers
- CORS configuration
- File upload restrictions

## Support

For support and questions, please contact: support@glorioustradehub.com

## License

This project is licensed under the MIT License.
