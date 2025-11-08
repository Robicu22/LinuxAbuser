# 🚀 Deployment Guide - LinuxAbuser Task Management App

## ✅ Pre-Deployment Checklist (COMPLETED)

All code changes have been made! Here's what was automated:

- ✅ Created API configuration file (`frontend/src/config/api.js`)
- ✅ Created environment files (`.env`, `.env.example`, `.env.production`)
- ✅ Updated all 14 frontend files to use `API_URL` instead of localhost
- ✅ Updated backend CORS for production
- ✅ Created `vercel.json` for SPA routing
- ✅ Updated `.gitignore` files

---

## 📋 Step-by-Step Deployment Instructions

### **Part 1: Deploy Backend to Render** ⚙️

#### 1. Create Render Account
- Go to https://render.com
- Sign up with GitHub account (recommended)

#### 2. Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the `LinuxAbuser` repository

#### 3. Configure Service Settings
Fill in these exact values:

| Setting | Value |
|---------|-------|
| **Name** | `linuxabuser-backend` (or your choice) |
| **Region** | Choose closest to you |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Instance Type** | Free |

#### 4. Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | Example: `mongodb+srv://username:password@cluster.mongodb.net/taskmanager` |
| `JWT_SECRET` | Strong random string | Example: `your-super-secret-jwt-key-12345` |
| `PORT` | `5000` | Render will override this automatically |
| `FRONTEND_URL` | Leave empty for now | You'll add this after deploying frontend |

**Getting MongoDB URI:**
- Go to MongoDB Atlas → Clusters → Connect
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your database password
- Replace `myFirstDatabase` with your database name (e.g., `taskmanager`)

#### 5. Deploy Backend
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. **COPY YOUR BACKEND URL** (looks like `https://linuxabuser-backend.onrender.com`)
4. **IMPORTANT:** Test it by visiting `https://your-backend-url.onrender.com/` - you should see "Server is running"

---

### **Part 2: Deploy Frontend to Vercel** 🎨

#### 1. Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub account

#### 2. Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your `LinuxAbuser` repository
3. Vercel will auto-detect it's a Vite app

#### 3. Configure Build Settings
| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `dist` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |

#### 4. Add Environment Variable
Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com/api` |

**IMPORTANT:** Replace `your-backend-url.onrender.com` with your actual Render backend URL from Part 1, Step 5.

**Example:**
```
VITE_API_URL=https://linuxabuser-backend.onrender.com/api
```

#### 5. Deploy Frontend
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. **COPY YOUR FRONTEND URL** (looks like `https://linuxabuser.vercel.app`)

---

### **Part 3: Connect Frontend & Backend** 🔗

#### 1. Update Backend CORS
1. Go back to Render dashboard
2. Select your backend service
3. Go to **"Environment"** tab
4. Add/update this variable:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` |

**Example:**
```
FRONTEND_URL=https://linuxabuser.vercel.app
```

5. Click **"Save Changes"**
6. Backend will automatically redeploy (takes 1-2 minutes)

---

## 🧪 Testing Your Deployment

### 1. Test Backend Health
- Visit: `https://your-backend-url.onrender.com/`
- Should see: `"Server is running"`

### 2. Test Frontend
- Visit: `https://your-vercel-app.vercel.app`
- Should see: Login page loads correctly

### 3. Test Full Flow
1. **Sign Up** - Create a new account
2. **Log In** - Use the account you created
3. **Create Workspace** - Admin should be able to create workspace
4. **Create Task** - Admin assigns task to user
5. **Check Inbox** - User should receive notification
6. **Accept Task** - User accepts the task
7. **Toggle/Delete** - Test task actions

---

## 🚨 Common Issues & Solutions

### Issue: "Network Error" when logging in
**Cause:** Frontend can't reach backend  
**Fix:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Make sure it ends with `/api` (e.g., `https://backend.onrender.com/api`)
3. Redeploy frontend after changing env vars

### Issue: "CORS Error" in browser console
**Cause:** Backend doesn't allow frontend origin  
**Fix:**
1. Check `FRONTEND_URL` in Render environment variables
2. Make sure it matches your Vercel URL exactly (no trailing slash)
3. Backend will auto-redeploy

### Issue: Backend shows "Application failed to respond"
**Cause:** MongoDB connection failed  
**Fix:**
1. Check `MONGODB_URI` in Render is correct
2. Verify MongoDB Atlas allows connections from anywhere (IP: `0.0.0.0/0`)
3. Check database password has no special characters that need escaping

### Issue: Render backend is slow to respond
**Cause:** Free tier spins down after inactivity  
**Fix:**
- First request after inactivity takes 30-60 seconds (this is normal on free tier)
- Paid tier keeps service always active

---

## 📝 Environment Variables Summary

### Backend (Render):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your-super-secret-jwt-key-12345
PORT=5000
FRONTEND_URL=https://linuxabuser.vercel.app
```

### Frontend (Vercel):
```
VITE_API_URL=https://linuxabuser-backend.onrender.com/api
```

---

## 🎯 Quick Reference URLs

| Service | URL Example | Your URL |
|---------|-------------|----------|
| **Backend** | `https://linuxabuser-backend.onrender.com` | _________________ |
| **Backend API** | `https://linuxabuser-backend.onrender.com/api` | _________________ |
| **Frontend** | `https://linuxabuser.vercel.app` | _________________ |
| **MongoDB** | `mongodb+srv://...` | _________________ |

---

## 🔄 Making Updates After Deployment

### Update Frontend Code:
1. Make changes locally
2. Commit & push to GitHub: `git add . && git commit -m "update" && git push`
3. Vercel auto-deploys (30 seconds)

### Update Backend Code:
1. Make changes locally
2. Commit & push to GitHub: `git add . && git commit -m "update" && git push`
3. Render auto-deploys (2-3 minutes)

### Update Environment Variables:
- **Vercel:** Dashboard → Project → Settings → Environment Variables → Redeploy
- **Render:** Dashboard → Service → Environment → Save Changes (auto-redeploys)

---

## ✅ Deployment Complete!

Your app is now live on the web! 🎉

**What you accomplished:**
- ✅ Backend API deployed on Render (free tier)
- ✅ Frontend deployed on Vercel (free tier)
- ✅ MongoDB Atlas database (free tier)
- ✅ Automatic deployments on code push
- ✅ Production-ready CORS & environment config
- ✅ Full notification system working
- ✅ Admin edit functionality working

**Share your app:**
- Send your Vercel URL to anyone: `https://your-app.vercel.app`
- They can sign up and start using it immediately!

---

Need help? Check:
- Render logs: Dashboard → Service → Logs
- Vercel logs: Dashboard → Project → Deployments → Click deployment → View Function Logs
- Browser console: F12 → Console tab (check for errors)
