# ANFA PRO - Advanced URL Shortener

A modern, AI-powered URL shortening platform with advanced analytics, QR code generation, and comprehensive user management.

## 🚀 Features

### Core Features
- **Smart URL Shortening**: Create short, memorable URLs with custom aliases
- **Advanced Analytics**: Track clicks, geographic data, device types, and referral sources
- **QR Code Generation**: Generate QR codes for easy mobile sharing
- **Real-time Dashboard**: Monitor your links with live statistics
- **User Authentication**: Secure login with email verification
- **Profile Management**: Complete user profile with avatar and preferences
- **Two-Factor Authentication**: Enhanced security with 2FA support

### Security Features
- **Email Verification**: All users must verify their email before login
- **Disposable Email Protection**: Blocks temporary/disposable email addresses
- **Malware Protection**: Advanced URL scanning for suspicious links
- **Rate Limiting**: Protection against abuse and spam
- **Secure Authentication**: JWT-based authentication with refresh tokens

### User Experience
- **Modern UI/UX**: Beautiful, responsive design with dark mode support
- **Mobile Optimized**: Perfect experience on all devices
- **Real-time Updates**: Live statistics and notifications
- **Social Sharing**: Easy sharing across all platforms
- **API Access**: RESTful API for developers

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Nodemailer** for email services
- **Bcrypt** for password hashing
- **Rate Limiting** for security

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Gmail account for email service

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/anfa-pro.git
cd anfa-pro
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

#### Backend Configuration
Create/update `backend/config.env`:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anfa-pro

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Frontend Configuration
Create/update `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Email Setup (Required)

#### Gmail App Password Setup
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the generated password
4. Update `backend/config.env`:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-16-digit-app-password
   ```

### 5. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Or use MongoDB Atlas (recommended)
# Update MONGODB_URI in config.env
```

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend
npm run dev
```

### Production Mode
```bash
# Build frontend
npm run build

# Start production server
cd backend
NODE_ENV=production npm start
```

## 📧 Email Verification System

### Features
- **Automatic Verification**: New users receive verification email upon registration
- **Welcome Emails**: Beautiful welcome emails sent to new users
- **Resend Functionality**: Users can request new verification emails
- **Disposable Email Protection**: Blocks temporary email services
- **Secure Tokens**: Time-limited verification tokens (10 minutes)

### Email Templates
- **Welcome Email**: Professional welcome with platform features
- **Verification Email**: Secure verification with clear instructions
- **Password Reset**: Secure password reset functionality

## 🔐 Security Features

### Authentication
- **Email Verification**: Required for all new accounts
- **JWT Tokens**: Secure authentication with refresh capability
- **Password Hashing**: Bcrypt with salt rounds
- **Rate Limiting**: Protection against brute force attacks

### URL Protection
- **Malware Scanning**: Detects suspicious URL patterns
- **Domain Blacklisting**: Blocks known malicious domains
- **Content Validation**: Validates URL structure and content

### User Protection
- **Disposable Email Blocking**: Prevents fake accounts
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Helmet.js security headers
- **CORS Configuration**: Proper cross-origin settings

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email` - Email verification
- `POST /api/auth/resend-verification` - Resend verification
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### URLs
- `POST /api/urls` - Create short URL
- `GET /api/urls` - Get user URLs
- `GET /api/urls/:id/analytics` - Get URL analytics
- `PUT /api/urls/:id` - Update URL
- `DELETE /api/urls/:id` - Delete URL

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/plan` - Update user plan
- `DELETE /api/users/profile` - Delete account

## 🎨 Customization

### Styling
- **Tailwind CSS**: Easy customization with utility classes
- **Dark Mode**: Built-in dark mode support
- **Responsive Design**: Mobile-first approach
- **Custom Themes**: Easy theme customization

### Features
- **Modular Architecture**: Easy to add new features
- **Component Library**: Reusable UI components
- **API Integration**: Simple API integration
- **Plugin System**: Extensible functionality

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build and deploy
npm run build
# Upload dist folder to Netlify
```

### Docker
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: Report bugs on GitHub
- **Discussions**: Join community discussions
- **Email**: support@anfapro.com

## 🔄 Updates

### Latest Features
- ✅ Real email verification system
- ✅ Disposable email protection
- ✅ Welcome email templates
- ✅ Enhanced security features
- ✅ Production-ready deployment
- ✅ Complete user management
- ✅ Advanced analytics dashboard

### Roadmap
- 🔄 Advanced analytics
- 🔄 API rate limiting
- 🔄 Team collaboration
- 🔄 Custom domains
- 🔄 Bulk URL operations
- 🔄 Advanced reporting

---

**ANFA PRO** - The future of URL shortening is here! 🚀 