# 🚀 Mini LinkedIn - Render Deployment Guide

## 📁 Project Structure
Your project has been reorganized for deployment:

```
Mini_Linkedin/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api.js         # ⚠️ API configuration (UPDATE THIS)
│   │   └── ...
│   ├── public/
│   │   └── _redirects     # React Router support
│   ├── .env               # Development environment
│   ├── .env.example       # Environment template
│   └── package.json
├── server/                 # Node.js Backend
│   ├── models/
│   ├── routes/
│   ├── .env               # Backend environment
│   ├── .env.example       # Environment template
│   └── server.js
└── DEPLOYMENT_GUIDE.md    # This file
```

## 🔧 Where to Update API URLs

### Frontend API Configuration
**File to update:** `client/src/api.js`

The API base URL is now configurable via environment variables:
```javascript
// API Base URL - Update this for deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
```

### Environment Files to Update:
1. **`client/.env`** - For development (already set)
2. **`client/.env.example`** - Template for production

## 🌐 Render Deployment Steps

### Step 1: Deploy Backend (Server)

1. **Create a new Web Service on Render:**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Backend Configuration:**
   ```
   Name: mini-linkedin-backend
   Environment: Node
   Region: Choose your preferred region
   Branch: main (or your default branch)
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables (Backend):**
   Add these in Render's Environment section:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mini-linkedin
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-app.onrender.com
   ```

4. **MongoDB Setup:**
   - Create a MongoDB Atlas account at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a cluster and get your connection string
   - Replace `MONGODB_URI` with your Atlas connection string

### Step 2: Deploy Frontend (Client)

1. **Create a Static Site on Render:**
   - Click "New +" → "Static Site"
   - Connect the same GitHub repository

2. **Frontend Configuration:**
   ```
   Name: mini-linkedin-frontend
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Environment Variables (Frontend):**
   Add this in Render's Environment section:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```
   ⚠️ **Replace `your-backend-app` with your actual backend service name**

### Step 3: Update CORS Configuration

After deploying frontend, update your backend's `CLIENT_URL` environment variable:
```
CLIENT_URL=https://your-frontend-app.onrender.com
```

## 🔄 React Router Support

✅ **Already configured!** The `client/public/_redirects` file handles React Router:
```
/*    /index.html   200
```

This ensures all routes redirect to `index.html`, allowing React Router to handle routing.

## 📝 Pre-Deployment Checklist

### Backend (`server/` folder):
- [ ] MongoDB Atlas connection string ready
- [ ] JWT secret generated (use a secure random string)
- [ ] Environment variables configured in Render
- [ ] CORS configured for production frontend URL

### Frontend (`client/` folder):
- [ ] API URL environment variable set to backend URL
- [ ] Build command works locally (`npm run build`)
- [ ] `_redirects` file exists in `public/` folder

## 🧪 Testing Deployment

1. **Test Backend:**
   - Visit: `https://your-backend-app.onrender.com/api/health`
   - Should return: `{"message": "Mini LinkedIn API is running!"}`

2. **Test Frontend:**
   - Visit: `https://your-frontend-app.onrender.com`
   - Test registration, login, and navigation
   - Check browser console for API connection errors

## 🔧 Local Development After Restructuring

### Start Backend:
```bash
cd server
npm install
npm start
```

### Start Frontend:
```bash
cd client
npm install
npm run dev
```

## 🚨 Common Issues & Solutions

### Issue: CORS Errors
**Solution:** Ensure `CLIENT_URL` in backend matches your frontend URL exactly

### Issue: API Not Found (404)
**Solution:** Check `VITE_API_URL` in frontend environment variables

### Issue: React Router 404 on Refresh
**Solution:** Ensure `_redirects` file exists in `client/public/`

### Issue: Environment Variables Not Working
**Solution:** Restart Render services after updating environment variables

## 📞 Support

If you encounter issues:
1. Check Render service logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for errors

---

**🎉 Your Mini LinkedIn app is now ready for deployment on Render!**
