## Project Flow and Model Overview

This document describes the end-to-end flow across modules and how each model participates.

### High-level Architecture
- Express server mounts all routes under `/api`.
- MVC structure: Routes → Controllers → Models → MySQL.
- Auth: JWT (user/admin). OTP for user login; email+password for admin.

### Data Models

- `users`: Basic profile and phone for OTP login.
- `otp_verifications`: Stores OTP codes with expiry + usage tracking.
- `admins`: Admin accounts with password hash.
- `categories`: Product taxonomy with `is_active`.
- `products`: Core catalog entity with pricing, stock, active/featured flags.
- `product_images`: Multiple images per product ordered by `position`.
- `carts` + `cart_items`: One cart per user; items unique per product.
- `addresses`: User shipping addresses; one can be default.
- `orders` + `order_items`: Immutable order snapshot with totals and status.
- `site_settings`: Key/value pairs for simple CMS-like settings.

### Core Flows

1) User Login (OTP)
- POST `/auth/send-otp` → generate and store code in `otp_verifications`.
- POST `/auth/verify-otp` → validate code, mark used, upsert `users`, issue JWT.
- GET `/auth/me` → returns current user using JWT.

2) Catalog Browsing
- GET `/products` → paginated list, includes thumbnail from `product_images`.
- GET `/products/featured` → featured subset.
- GET `/products/:id` → product + images.
- GET `/categories` → active categories.
- GET `/categories/:id/products` → products under category.

3) Cart
- GET `/cart` → ensures a cart in `carts`, returns `cart_items` with product info.
- POST `/cart/items` → add or increase quantity; unique constraint per product.
- PATCH `/cart/items/:productId` → set quantity or remove if <= 0.
- DELETE `/cart/items/:productId` → remove specific item.
- DELETE `/cart/clear` → clear all `cart_items`.

4) Addresses
- GET `/addresses` → list addresses for user, default first.
- POST `/addresses` → create; if `is_default=1`, unset others.
- PUT `/addresses/:id` → update; toggle default if needed.
- DELETE `/addresses/:id` → delete address.

5) Checkout and Orders (COD)
- Validate address belongs to user.
- Create order from `cart_items`, snapshotting product name and price into `order_items`.
- Decrement `products.stock_quantity` and clear cart within a transaction.
- GET `/orders` and `/orders/:id` to view history and details.

6) Admin
- POST `/admin/seed-initial-admin` → one-time bootstrap.
- POST `/admin/login` → JWT for admin.
- Products: CRUD + `PATCH /products/:id/activate` to toggle `is_active`.
- Categories: CRUD.
- Orders: list and update status.
- Settings: get and upsert by key.

### Validation and Error Handling
- `express-validator` used on critical auth inputs.
- Central `errorHandler` translates thrown errors to JSON with status.
- Transactions protect multi-step operations (product create/update with images, order creation).

### Indexes and Constraints
- Uniques: users.phone, users.email, admins.email, categories.slug, products.slug, site_settings.setting_key, cart_items(cart_id, product_id).
- FKs: products→categories, product_images→products, carts→users, cart_items→{carts,products}, addresses→users, orders→{users,addresses}, order_items→{orders,products}.

### Security Notes
- Use HTTPS in production.
- Keep `JWT_SECRET` strong; set `ALLOW_DEV_OTP_RESPONSE=false` in prod.
- Add rate limiting and request size limits as needed.

### Extensibility
- Add payment gateways by extending `orders` with payment intents.
- Add media uploads for product images (S3/local) and replace `image_url` with asset refs.
- Add inventory reservations for pre-payment workflows.
- Add admin roles/permissions if needed.
