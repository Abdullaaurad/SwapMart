# SwapMart Setup Guide

## Run .md file
use short cut key ctrl + shift + V

## Prerequisites Installation

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/) (v16 or higher)

### 2. Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### 3. Install Expo CLI
```bash
npm install -g expo-cli
```

## Database Setup

### 1. Create PostgreSQL Database
```bash
# Start PostgreSQL service
# Windows: Start from Services
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Create database
createdb swapmart_db

# Or using psql
psql -U postgres
CREATE DATABASE swapmart_db;
\q
```

### 2. Configure Environment Variables
Create a `.env` file in the Server directory:

```env
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_NAME=swapmart_db
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
NODE_ENV=development
```

## Backend Setup

### 1. Install Dependencies
```bash
cd Server
npm install
```

### 2. Initialize Database
```bash
npm run init-db
```

### 3. Start Server
```bash
npm run dev
```

The server should now be running on `http://localhost:3000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd Client
npm install
```

### 2. Configure API Endpoint
Edit `src/API/key.js`:
```javascript
export const BASE_URL = 'http://localhost:3000';
```

### 3. Start Development Server
```bash
npm start
```

## Testing the Setup

### 1. Test Backend
```bash
# Test database connection
curl http://localhost:3000/health

# Test user registration
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### 2. Test Frontend
- Scan QR code with Expo Go app
- Or run on emulator/simulator
- Test user registration flow

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify credentials in .env file
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:3000 | xargs kill`

3. **Expo Issues**
   - Clear cache: `expo r -c`
   - Reset Metro: `npx react-native start --reset-cache`

4. **Permission Issues**
   - Ensure proper file permissions
   - Run as administrator if needed

### Development Tips

1. **Backend Development**
   - Use `npm run dev` for auto-restart
   - Check logs in terminal
   - Use Postman for API testing

2. **Frontend Development**
   - Use Expo DevTools for debugging
   - Enable hot reloading
   - Test on multiple devices

3. **Database Management**
   - Use pgAdmin for database management
   - Backup database regularly
   - Monitor query performance

## Production Setup

### Backend Deployment
1. Set up production PostgreSQL
2. Configure environment variables
3. Set up reverse proxy (nginx)
4. Use PM2 for process management

### Frontend Deployment
1. Build for production: `expo build:android`
2. Upload to app stores
3. Configure production API endpoints

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS configuration
- [ ] Implement rate limiting
- [ ] Regular security updates

## Performance Optimization

- [ ] Enable database indexing
- [ ] Implement caching strategies
- [ ] Optimize image uploads
- [ ] Use CDN for static assets
- [ ] Monitor application performance 