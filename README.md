# SwapMart - Mobile Trading Platform

SwapMart is a comprehensive mobile trading platform built with React Native (Expo) for the frontend and Node.js/Express for the backend. The platform enables users to buy, sell, and trade items with a focus on user experience and security.

## 🏗️ System Architecture

```
SwapMart/
├── Client/                 # React Native (Expo) Frontend
│   ├── src/
│   │   ├── API/           # API configuration
│   │   ├── assets/        # Images and static files
│   │   ├── components/    # Reusable UI components
│   │   ├── constants/     # App constants and colors
│   │   └── screens/       # App screens
│   ├── App.js             # Main app component
│   └── package.json       # Frontend dependencies
└── Server/                # Node.js/Express Backend
    ├── controllers/       # Business logic handlers
    ├── db/               # Database setup and schema
    ├── middleware/       # Request validation
    ├── models/          # Database models (MVC)
    ├── routes/          # API route definitions
    ├── server.js        # Main server file
    └── package.json     # Backend dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Expo CLI** (`npm install -g expo-cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SwapMart
```

### 2. Backend Setup

```bash
cd Server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials:
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_NAME=swapmart_db

# Create PostgreSQL database
createdb swapmart_db

# Initialize database schema
npm run init-db

# Start the server
npm run dev
```

The server will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd Client

# Install dependencies
npm install

# Start the development server
npm start
```

The Expo development server will start and show a QR code for mobile testing.

## 📱 Features

### User Management
- ✅ User registration and authentication
- ✅ Profile creation with photo upload
- ✅ Location-based services with GPS
- ✅ Email and phone verification
- ✅ Two-step onboarding process

### Product Management
- ✅ Product listing and search
- ✅ Category-based browsing
- ✅ Image upload for products
- ✅ Product condition tracking
- ✅ Location-based product discovery

### Trading System
- ✅ Offer creation and management
- ✅ Real-time messaging between users
- ✅ Trade status tracking
- ✅ Review and rating system

### User Experience
- ✅ Modern, intuitive UI/UX
- ✅ Real-time notifications
- ✅ Offline capability
- ✅ Push notifications
- ✅ Social features

## 🗄️ Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts and profiles |
| `categories` | Product categories |
| `products` | Items for sale/trade |
| `offers` | Purchase offers |
| `messages` | User communications |
| `reviews` | User ratings and feedback |
| `saved_items` | User's saved products |
| `user_activity` | Activity tracking |

### Key Features
- **PostgreSQL** with proper indexing
- **JWT** authentication
- **Password hashing** with bcrypt
- **Image storage** support
- **Location services** integration

## 🔧 API Endpoints

### Authentication
```
POST /users/signup     # User registration
POST /users/login      # User login
POST /users/onboard    # Complete user profile
```

### Products
```
GET    /products       # List all products
POST   /products       # Create new product
GET    /products/:id   # Get product details
PUT    /products/:id   # Update product
DELETE /products/:id   # Delete product
```

### Categories
```
GET /categories        # List all categories
GET /categories/:id    # Get category details
```

### Offers
```
POST   /offers        # Create offer
GET    /offers        # List user's offers
PUT    /offers/:id    # Update offer status
```

## 🏛️ Architecture Patterns

### Backend (MVC Pattern)
- **Models**: Database operations and business logic
- **Controllers**: HTTP request/response handling
- **Routes**: API endpoint definitions
- **Middleware**: Request validation and authentication

### Frontend (Component-Based)
- **Screens**: Main app views
- **Components**: Reusable UI elements
- **Constants**: App configuration
- **API**: Backend communication

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Cross-origin request handling

## 📱 Mobile Features

### Permissions
- **Camera**: Profile photo capture
- **Location**: GPS-based services
- **Storage**: Image and data caching

### Native Integrations
- **Image Picker**: Photo selection
- **Location Services**: GPS coordinates
- **Push Notifications**: Real-time alerts
- **Offline Storage**: AsyncStorage for data persistence

## 🛠️ Development

### Backend Development

```bash
cd Server

# Development mode with auto-restart
npm run dev

# Database operations
npm run init-db    # Initialize database
npm run reset-db   # Reset database (if available)
```

### Frontend Development

```bash
cd Client

# Start Expo development server
npm start

# Run on specific platform
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser
```

### Environment Variables

#### Server (.env)
```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=swapmart_db
JWT_SECRET=your_jwt_secret
PORT=3000
```

#### Client (API/key.js)
```javascript
export const BASE_URL = 'http://localhost:3000';
```

## 📦 Dependencies

### Backend Dependencies
- **Express**: Web framework
- **PostgreSQL**: Database
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

### Frontend Dependencies
- **React Native**: Mobile framework
- **Expo**: Development platform
- **React Navigation**: Navigation system
- **Axios**: HTTP client
- **Expo Image Picker**: Image selection
- **Expo Location**: GPS services

## 🧪 Testing

### Backend Testing
```bash
cd Server
npm test
```

### Frontend Testing
```bash
cd Client
npm test
```

## 📊 Performance

### Database Optimization
- **Indexes**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Minimal database calls

### Mobile Optimization
- **Image Compression**: Optimized photo uploads
- **Lazy Loading**: Efficient data loading
- **Caching**: Offline data persistence

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to cloud platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build Expo app: `expo build:android` or `expo build:ios`
2. Upload to app stores (Google Play, App Store)
3. Configure production API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with basic trading functionality
- **v1.1.0**: Added onboarding and profile features
- **v1.2.0**: Enhanced security and performance

---

**SwapMart** - Making trading simple and secure! 🚀 