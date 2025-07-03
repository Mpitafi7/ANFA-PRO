# ANFA PRO Backend API

A powerful URL shortener backend built with Node.js, Express, and MongoDB.

## Features

- 🔐 **User Authentication** - JWT-based authentication with bcrypt password hashing
- 🔗 **URL Shortening** - Create custom or auto-generated short URLs
- 📊 **Analytics** - Track clicks, unique visitors, and detailed analytics
- 🛡️ **Security** - Password-protected URLs, rate limiting, and validation
- 📱 **QR Codes** - Auto-generated QR codes for each short URL
- 🎯 **Custom Aliases** - Create memorable custom short URLs
- 📈 **User Plans** - Free, Pro, and Enterprise plans with different limits
- 🔍 **Search & Filter** - Advanced search and filtering capabilities
- 📅 **Expiration** - Set expiration dates for URLs
- 🏷️ **Tags & Categories** - Organize URLs with tags and descriptions

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **URL Generation**: nanoid
- **Validation**: Built-in Mongoose validation
- **CORS**: Cross-origin resource sharing enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `config.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/anfa-pro
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud instance.

4. **Run the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 🚀 Deployment Guide

### Option 1: Render.com (Free)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Connect Repository**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder

3. **Configure Service**
   ```
   Name: anfa-pro-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**
   Add these in Render dashboard:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=10000
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)

### Option 2: Railway.app (Free)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `backend`

3. **Environment Variables**
   Add the same variables as above

### Option 3: Heroku (Paid)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Deploy**
   ```bash
   cd backend
   heroku create anfa-pro-backend
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Free)

1. **Create Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Choose "Shared" → "Free" tier
   - Select region (closest to you)
   - Click "Create"

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Environment Variable**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anfa-pro?retryWrites=true&w=majority
   ```

## 🔧 Local Development

```bash
cd backend
npm install
npm run dev
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### URLs
- `POST /api/urls` - Create short URL
- `GET /api/urls` - Get user's URLs
- `GET /api/urls/:id` - Get URL details
- `DELETE /api/urls/:id` - Delete URL

### Analytics
- `GET /api/urls/:id/clicks` - Get URL click analytics

## 🔒 Security

- JWT authentication
- Password hashing with bcrypt
- CORS enabled
- Environment variables for secrets
- Input validation

## 📊 Monitoring

- Health check endpoint: `GET /api/health`
- Error logging
- Request/response logging

## 🚀 Production Checklist

- [ ] Environment variables set
- [ ] MongoDB Atlas connected
- [ ] JWT secret configured
- [ ] CORS origins updated
- [ ] Error handling tested
- [ ] API endpoints tested
- [ ] SSL certificate (automatic on Render/Railway)

## 📞 Support

For deployment issues, check:
1. Environment variables
2. MongoDB connection
3. Port configuration
4. Build logs in deployment platform

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |
| POST | `/api/auth/logout` | Logout user | Private |

### URLs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/urls` | Create short URL | Private |
| GET | `/api/urls` | Get user's URLs | Private |
| GET | `/api/urls/redirect/:shortCode` | Redirect to original URL | Public |
| GET | `/api/urls/:id/analytics` | Get URL analytics | Private |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users/profile` | Get user profile | Private |
| PUT | `/api/users/plan` | Update user plan | Private |

## Database Models

### User Model
- Username, email, password
- Plan management (free/pro/enterprise)
- URL creation limits
- Authentication and authorization

### URL Model
- Original and shortened URLs
- Custom aliases
- Analytics tracking
- Password protection
- Expiration dates
- QR codes

### Click Model
- Detailed click tracking
- IP address and user agent
- Geographic data
- Device and browser info
- Unique click detection

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get a token
2. **Include token** in request headers:
   ```
   Authorization: Bearer <your-token>
   ```
3. **Token expires** after 30 days

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/anfa-pro |
| JWT_SECRET | JWT signing secret | Required |
| NODE_ENV | Environment mode | development |

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Rate limiting
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection
- ✅ Secure headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 