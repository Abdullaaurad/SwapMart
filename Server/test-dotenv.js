const dotenv = require('dotenv');
const path = require('path');

console.log('=== DOTENV TEST ===');
console.log('Current directory:', __dirname);
console.log('Env file path:', path.join(__dirname, '.env'));

// Try loading the .env file
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
  console.log('Error loading .env:', result.error);
} else {
  console.log('Successfully loaded .env file');
}

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('=================='); 