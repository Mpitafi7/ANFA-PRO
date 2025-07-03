# ANFA PRO - AI-Powered URL Shortener

A modern, AI-powered URL shortener with QR code generation, analytics, and beautiful UI.

## 🚀 Quick Deployment Guide

### **Step 1: Database Setup (MongoDB Atlas)**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster (Free tier)
4. Get connection string

### **Step 2: Backend Deployment (Render.com)**
1. Go to [render.com](https://render.com)
2. Create account with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Set root directory to `backend`
6. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=10000
   NODE_ENV=production
   ```

### **Step 3: Frontend Deployment (Netlify)**
1. Go to [netlify.com](https://netlify.com)
2. Create account with GitHub
3. Click "New site from Git"
4. Connect your repository
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

## 📁 Project Structure

```
ANFA PRO/
├── backend/                 # Node.js API server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & error handling
│   └── server.js           # Main server file
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── entities/           # API integration
│   ├── utils/              # Utilities
│   └── main.jsx           # App entry point
├── Pages/                  # Page components
└── public/                 # Static assets
```

## 🛠️ Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

## 🌟 Features

- ✅ **URL Shortening** - Create custom short URLs
- ✅ **QR Code Generation** - Generate QR codes for URLs
- ✅ **Analytics** - Track clicks and performance
- ✅ **User Authentication** - Secure login/register
- ✅ **Dashboard** - Manage all your URLs
- ✅ **PWA Support** - Install as mobile app
- ✅ **Dark/Light Mode** - Beautiful themes
- ✅ **Responsive Design** - Works on all devices

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anfa-pro
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 📱 PWA Features

- Install prompt
- Offline caching
- App-like experience
- Push notifications (coming soon)

## 🎨 UI/UX Features

- Glass morphism effects
- Smooth animations
- Gradient backgrounds
- Professional styling
- Mobile-first design

## 🔒 Security

- JWT authentication
- Password hashing
- CORS protection
- Input validation
- Rate limiting

## 📊 Analytics

- Click tracking
- Geographic data
- Device information
- Referrer tracking
- Time-based analytics

## 🚀 Deployment Options

### Free Options
- **Backend**: Render.com, Railway.app
- **Frontend**: Netlify, Vercel
- **Database**: MongoDB Atlas

### Paid Options
- **Backend**: Heroku, DigitalOcean
- **Frontend**: Vercel Pro, Netlify Pro
- **Database**: MongoDB Atlas (paid plans)

## 📝 API Documentation

### Authentication
```
POST /api/auth/register - Register user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user
```

### URLs
```
POST /api/urls - Create short URL
GET /api/urls - Get user's URLs
GET /api/urls/:id - Get URL details
DELETE /api/urls/:id - Delete URL
```

### Analytics
```
GET /api/urls/:id/clicks - Get click analytics
```

## 🎯 Roadmap

- [ ] Custom domains
- [ ] Bulk URL import
- [ ] Advanced analytics
- [ ] Team collaboration
- [ ] API rate limits
- [ ] Email notifications

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints
4. Check MongoDB connection

## 🎉 Success!

Your ANFA PRO URL shortener is now ready for production! 🚀

---

**Built with ❤️ by ANFA Tech** 