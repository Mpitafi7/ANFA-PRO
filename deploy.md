# 🚀 ANFA PRO Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Database Setup (MongoDB Atlas)
- [ ] Create MongoDB Atlas account
- [ ] Create new cluster (Free tier)
- [ ] Create database user
- [ ] Get connection string
- [ ] Test connection locally

### 2. Backend Preparation
- [ ] Update `backend/package.json` with start script
- [ ] Test backend locally with MongoDB
- [ ] Verify all environment variables work
- [ ] Test API endpoints

### 3. Frontend Preparation
- [ ] Update API base URL configuration
- [ ] Test frontend with backend
- [ ] Build frontend locally (`npm run build`)
- [ ] Verify PWA works

## 🎯 Deployment Steps

### Step 1: Backend Deployment (Render.com)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Configure:
     ```
     Name: anfa-pro-backend
     Environment: Node
     Build Command: npm install
     Start Command: npm start
     ```

3. **Set Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anfa-pro
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=10000
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy the URL (e.g., `https://anfa-pro-backend.onrender.com`)

### Step 2: Frontend Deployment (Netlify)

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New site from Git"
   - Connect your GitHub repository
   - Configure build settings:
     ```
     Build command: npm run build
     Publish directory: dist
     ```

3. **Set Environment Variable**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment (1-2 minutes)
   - Copy the URL (e.g., `https://anfa-pro.netlify.app`)

### Step 3: Testing

1. **Test Backend**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"ANFA PRO API is running"}`

2. **Test Frontend**
   - Visit your Netlify URL
   - Test registration/login
   - Test URL shortening
   - Test QR code generation

3. **Test PWA**
   - Open in mobile browser
   - Check install prompt
   - Test offline functionality

## 🔧 Troubleshooting

### Backend Issues
- **Build fails**: Check package.json and dependencies
- **Database connection**: Verify MONGODB_URI
- **Port issues**: Ensure PORT=10000
- **CORS errors**: Check frontend URL in backend config

### Frontend Issues
- **API calls fail**: Check VITE_API_BASE_URL
- **Build fails**: Check dependencies and imports
- **PWA not working**: Verify manifest.json and service worker

### Common Solutions
1. **Clear cache**: Hard refresh browser
2. **Check logs**: View deployment logs in platform
3. **Restart service**: Redeploy if needed
4. **Verify URLs**: Ensure no typos in URLs

## 📱 Post-Deployment

### 1. Custom Domain (Optional)
- **Netlify**: Add custom domain in settings
- **SSL**: Automatic with Netlify/Render

### 2. Monitoring
- **Backend**: Check Render logs
- **Frontend**: Check Netlify analytics
- **Database**: Monitor MongoDB Atlas

### 3. Updates
- **Backend**: Auto-deploy on git push
- **Frontend**: Auto-deploy on git push
- **Environment**: Update variables in platform

## 🎉 Success!

Your ANFA PRO URL shortener is now live! 🚀

**Frontend**: https://your-app.netlify.app
**Backend**: https://your-backend.onrender.com
**Database**: MongoDB Atlas

---

**Need help?** Check the main README.md for detailed documentation. 