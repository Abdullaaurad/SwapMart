# Server Architecture

This server follows the MVC (Model-View-Controller) pattern for better code organization and maintainability.

## Directory Structure

```
Server/
├── controllers/     # Business logic and request handling
├── models/         # Database operations and data validation
├── middleware/     # Request validation and authentication
├── routes/         # API route definitions
├── db/            # Database connection
└── server.js      # Main server file
```

## Models

Models handle all database operations and business logic related to data. They encapsulate the data access layer and provide a clean interface for controllers.

### User Model

The `User` model provides the following methods:

- `User.findByUsername(username)` - Find user by username
- `User.findById(id)` - Find user by ID
- `User.create(username, password)` - Create a new user with validation
- `User.authenticate(username, password)` - Authenticate user login
- `User.updateOnboardStatus(userId, status)` - Update user onboarding status

## Controllers

Controllers handle HTTP requests and responses. They use models for data operations and focus on:
- Request/response handling
- Error handling
- Status code management
- Data transformation

## Middleware

Middleware functions handle cross-cutting concerns:
- `validateSignUp` - Validates signup request data
- `validateLogin` - Validates login request data

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Reusability**: Models can be used across different controllers
3. **Testability**: Each component can be tested independently
4. **Maintainability**: Changes to database logic only affect models
5. **Scalability**: Easy to add new models and controllers

## Usage Example

```javascript
// In a controller
const { User } = require('../models');

// Create user
const user = await User.create(username, password);

// Authenticate user
const user = await User.authenticate(username, password);
```

## Error Handling

The architecture provides consistent error handling:
- Models throw descriptive errors
- Controllers catch and format errors for API responses
- Proper HTTP status codes are returned 