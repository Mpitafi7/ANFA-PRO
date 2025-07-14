# 🌐 ANFA PRO – Smart URL Management Platform

ANFA PRO is a modern, full-stack SaaS platform for shortening, tracking, and managing URLs. Designed with scalability, personalization, and security in mind — ANFA PRO empowers users with deep analytics, smart sharing, and AI-enhanced tools.


## 🚀 Features

 **Smart URL Shortening**  
  Create short, memorable URLs with optional custom aliases.

 **Advanced Analytics**  
  Track total clicks, top countries, device types, and referral sources.

 **QR Code & Barcode Generation**  
  Generate QR codes and barcodes (Code 128, Code 39) for any URL.

 **Subscription Plans (Basic, Pro, Team)**  
  Feature-based access per plan, with upgrade options.

 **Feature-Based Access Control**  
  Each user only accesses what their plan allows.

 **AI-Powered Chatbot**  
  Describe issues to get professionally written email drafts. It's Work With API 

 **User Authentication & Profiles**  
  Secure email/password login with JWT & email verification.  
  Each user has a public profile page (e.g. `/u/u_7a2d1b`).

 **Copy-to-Clipboard Utilities**  
  For links, emails, and profile URLs.

 **Admin Panel**  
  Admins can manage users, plans, scores, and visibility.

 **Real-Time Dashboard**  
  Live stats, link insights, and social sharing tools.

 **Modern Pricing Page**  
  Dynamic, responsive design with Stripe payment integration.

 **Badges & Scoreboard**  
  Verified badges and usage stats per user (links created, views, etc.)

 **Responsive & Elegant UI**  
  Light/dark mode, gradient borders, mobile optimized.

 **Public Profile System**  
  Each user has a shareable, view-only public identity page.

 **Security Features**  
   Email verification  
   Disposable email detection  
  JWT token auth  
   Bcrypt password hashing  
   Rate limiting  
   XSS & CORS protection  
 Admin-only sensitive endpoints


## 🛠️ Technologies Used

### 🧩 Frontend

 **React 18** (with Vite)
 **React Router DOM** – Routing
 **Tailwind CSS** – Styling
 **Framer Motion** – Animations
 **Lucide React** – Icon system
 **Axios** – HTTP requests
 **jsbarcode / react-qr-code** – Barcode + QR generation
 **date-fns** – Date formatting
 **Radix UI** – Accessible UI components
 **Service Worker** – PWA support

### 🔧 Backend

 **Node.js** – Runtime
 **Express.js** – REST API framework
 **MongoDB + Mongoose** – Database
 **Firebase Auth** – (used in some flows)
 **JWT** – Token-based authentication
 **Bcrypt** – Password hashing
 **Nodemailer** – Email sending
 **Rate Limiter & Helmet** – Security
 **CORS** – Safe API access

Note: This project includes AI-assisted components. All logic, security, and final implementation are manually reviewed and customized for production-grade quality.

