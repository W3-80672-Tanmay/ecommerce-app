# E-commerce Backend API

A complete Node.js + Express + MySQL backend for e-commerce applications with user authentication via OTP, admin panel, and full CRUD operations.

## Features

### User Features
- Mobile OTP authentication
- View featured products
- Browse all products with search and filtering
- View product categories and products within categories
- Add products to cart
- Checkout with COD payment
- Order placement and history
- Address management

### Admin Features
- Product management (CRUD, activate/inactivate, featured)
- Category management (CRUD)
- Order management and status updates
- Site settings management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT + OTP
- **Architecture**: MVC pattern

## Project Structure

```
├── config/
│   ├── index.js          # Configuration settings
│   └── db.js             # Database connection
├── controllers/          # Business logic
│   ├── auth.controller.js
│   ├── category.controller.js
│   ├── product.controller.js
│   ├── cart.controller.js
│   ├── order.controller.js
│   ├── address.controller.js
│   └── admin.controller.js
├── models/               # Database operations
│   ├── user.model.js
│   ├── otp.model.js
│   ├── category.model.js
│   ├── product.model.js
│   ├── cart.model.js
│   ├── address.model.js
│   ├── order.model.js
│   ├── admin.model.js
│   └── siteSetting.model.js
├── routes/               # API endpoints
│   ├── index.js
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── category.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   ├── address.routes.js
│   └── admin.routes.js
├── middlewares/          # Middleware functions
│   ├── auth.js           # Authentication middleware
│   └── errorHandler.js   # Error handling
├── utils/                # Utility functions
│   ├── jwt.js            # JWT operations
│   └── otp.js            # OTP generation
├── sql/
│   └── schema.sql        # Database schema
├── server.js             # Main server file
├── package.json
└── env.example           # Environment variables template
```

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database
2. Import the schema:
   ```bash
   mysql -u your_username -p your_database < sql/schema.sql
   ```

### 2. Environment Configuration

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your database credentials:
   ```env
   PORT=4000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=ecommerce_db
   
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   
   OTP_EXPIRY_MINUTES=10
   ALLOW_DEV_OTP_RESPONSE=true
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and get token
- `GET /api/auth/me` - Get current user info (requires auth)

### Products (Public)
- `GET /api/products` - Get all products with pagination
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product details

### Categories (Public)
- `GET /api/categories` - Get all active categories
- `GET /api/categories/:id/products` - Get products in category

### Cart (User Auth Required)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/:productId` - Update cart item quantity
- `DELETE /api/cart/items/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders (User Auth Required)
- `POST /api/orders` - Place new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

### Addresses (User Auth Required)
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Admin Endpoints (Admin Auth Required)

#### Authentication
- `POST /api/admin/seed-initial-admin` - Create first admin (run once)
- `POST /api/admin/login` - Admin login

#### Products
- `GET /api/admin/products` - List all products (admin view)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `PATCH /api/admin/products/:id/activate` - Toggle product active status

#### Categories
- `GET /api/admin/categories` - List all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

#### Orders
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/:id/status` - Update order status

#### Settings
- `GET /api/admin/settings` - Get all site settings
- `PUT /api/admin/settings/:key` - Update specific setting

## Authentication

### User Authentication (OTP)
1. Send OTP: `POST /api/auth/send-otp` with `{ "phone": "9999999999" }`
2. Verify OTP: `POST /api/auth/verify-otp` with `{ "phone": "9999999999", "otp": "123456" }`
3. Use returned token in `Authorization: Bearer <token>` header

### Admin Authentication
1. Create first admin: `POST /api/admin/seed-initial-admin` (run once)
2. Login: `POST /api/admin/login` with `{ "email": "admin@example.com", "password": "Admin@123" }`
3. Use returned token in `Authorization: Bearer <token>` header

## Development Notes

- OTP codes are returned in development mode when `ALLOW_DEV_OTP_RESPONSE=true`
- All database queries use prepared statements to prevent SQL injection
- JWT tokens include role-based access control
- Error handling middleware provides consistent error responses
- Database transactions ensure data consistency for critical operations

## Production Considerations

- Set `NODE_ENV=production`
- Use strong JWT secrets
- Set `ALLOW_DEV_OTP_RESPONSE=false`
- Integrate with SMS provider for OTP delivery
- Add rate limiting
- Configure proper CORS settings
- Set up logging and monitoring
- Use HTTPS in production

## License

MIT License
