# Database Setup

This directory contains all database-related files for the SwapMart application.

## Files

- `index.js` - Database connection pool
- `schema.sql` - Database schema with all tables
- `init.js` - Database initialization script
- `README.md` - This documentation

## Database Schema

The application uses PostgreSQL with the following tables:

### Core Tables
- **users** - User accounts and profiles
- **categories** - Product categories
- **products** - Items for sale/trade
- **offers** - Purchase offers
- **swaps** - Completed trades
- **messages** - User communications
- **reviews** - User ratings and feedback
- **saved_items** - User's saved products
- **user_activity** - Activity tracking

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the Server directory with:
```
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=swapmart_db
```

### 2. Create Database
```sql
CREATE DATABASE swapmart_db;
```

### 3. Initialize Database
```bash
npm run init-db
```

This will:
- Create all tables
- Insert default categories
- Create necessary indexes
- Test the connection

## Models

The application uses models to interact with the database:

### User Model
```javascript
const { User } = require('../models');

// Create user
const user = await User.create(username, password);

// Authenticate user
const user = await User.authenticate(username, password);

// Find user by username
const user = await User.findByUsername(username);
```

### Product Model
```javascript
const { Product } = require('../models');

// Create product
const product = await Product.create(productData);

// Find products by category
const products = await Product.findByCategory(categoryId);

// Search products
const products = await Product.search(query);
```

### Category Model
```javascript
const { Category } = require('../models');

// Get all categories
const categories = await Category.findAll();

// Get categories with product count
const categories = await Category.getWithProductCount();
```

### Offer Model
```javascript
const { Offer } = require('../models');

// Create offer
const offer = await Offer.create(offerData);

// Get user's offers
const offers = await Offer.findByBuyer(userId);
```

## Database Operations

All database operations are handled through models, which provide:
- Input validation
- Error handling
- Consistent data formatting
- Security (SQL injection prevention)

## Indexes

The following indexes are created for performance:
- `idx_products_seller_id` - Products by seller
- `idx_products_category_id` - Products by category
- `idx_offers_buyer_id` - Offers by buyer
- `idx_offers_seller_id` - Offers by seller
- `idx_messages_sender_id` - Messages by sender
- `idx_messages_receiver_id` - Messages by receiver
- `idx_saved_items_user_id` - Saved items by user

## Backup and Migration

For production deployments, consider:
- Regular database backups
- Migration scripts for schema changes
- Data validation before deployment 