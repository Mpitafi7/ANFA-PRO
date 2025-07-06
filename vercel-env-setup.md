# Vercel Environment Variables Setup

## Required Environment Variables for Vercel

Add these environment variables in your Vercel dashboard:

### Database Configuration
```
MONGODB_URI=mongodb+srv://muntazirmahdi069:YourActualPassword@cluster0.hoi6onw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### JWT Configuration
```
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### Email Configuration (Gmail)
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
```

### Frontend URL
```
FRONTEND_URL=https://anfa-pd0kyf1t4-mpitafi7s-projects.vercel.app
```

### Node Environment
```
NODE_ENV=production
```

## How to Add Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" tab
4. Click on "Environment Variables"
5. Add each variable above with its value
6. Make sure to select "Production" environment
7. Click "Save"

## Important Notes:

- **MongoDB Password**: Replace `YourActualPassword` with your real MongoDB password
- **JWT Secret**: Use a long, random string for security
- **Gmail App Password**: Generate this in your Google Account settings
- **Frontend URL**: Use your actual Vercel app URL: `https://anfa-pd0kyf1t4-mpitafi7s-projects.vercel.app`

## Gmail App Password Setup:

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Use that 16-digit password in EMAIL_PASSWORD

## After Adding Environment Variables:

1. Redeploy your app in Vercel
2. Test the login functionality
3. Check if email verification works

## Troubleshooting:

- If login doesn't work, check browser console for errors
- If emails don't send, verify Gmail app password
- If database connection fails, check MongoDB URI 