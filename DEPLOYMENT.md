# 🚀 Backend Deployment Guide

## 📍 **Deploy to Render (Recommended)**

### **Step 1: Prepare Your Google Sheets Credentials**

1. **Get your service account JSON:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to your project → IAM & Admin → Service Accounts
   - Find your service account and download the JSON key
   - **IMPORTANT**: Keep this file secure!

2. **Convert JSON to environment variable:**
   ```bash
   # Copy the entire JSON content and escape quotes
   # Example: {"type":"service_account","project_id":"..."}
   ```

### **Step 2: Deploy to Render**

1. **Go to [render.com](https://render.com)**
2. **Sign up/Login with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure the service:**

   **Basic Settings:**
   - **Name**: `sheets-editor-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`

   **Build & Deploy:**
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty

6. **Click "Create Web Service"**

### **Step 3: Set Environment Variables**

In your Render dashboard:

1. **Go to Environment → Environment Variables**
2. **Add these variables:**

   ```
   GOOGLE_SHEETS_CREDENTIALS = {"type":"service_account","project_id":"your-project-id",...}
   GOOGLE_SPREADSHEET_ID = 1_LSiD3swkfgT3hEWpIZ4gsL_P7VcB4rYfYfM40EHuVA
   NODE_ENV = production
   PORT = 10000
   ```

3. **Click "Save Changes"**
4. **Redeploy** (Render will auto-deploy)

### **Step 4: Test Your API**

1. **Wait for deployment to complete** (green status)
2. **Copy your API URL** (e.g., `https://sheets-editor-api.onrender.com`)
3. **Test endpoints:**
   ```bash
   # Health check
   curl https://your-api-url.onrender.com/health
   
   # Configuration
   curl https://your-api-url.onrender.com/config
   
   # Tabs
   curl https://your-api-url.onrender.com/tabs
   ```

## 🔧 **Alternative: Railway Deployment**

### **Step 1: Deploy to Railway**
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Deploy from root directory
4. Set environment variables in Railway dashboard

### **Step 2: Set Environment Variables**
Same variables as Render above.

## 🌐 **Alternative: Heroku Deployment**

### **Step 1: Deploy to Heroku**
1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect GitHub repository
4. Enable automatic deploys

### **Step 2: Set Environment Variables**
```bash
heroku config:set GOOGLE_SHEETS_CREDENTIALS='{"type":"service_account",...}'
heroku config:set GOOGLE_SPREADSHEET_ID=1_LSiD3swkfgT3hEWpIZ4gsL_P7VcB4rYfYfM40EHuVA
heroku config:set NODE_ENV=production
```

## ✅ **Deployment Checklist**

- [ ] Google Sheets credentials ready
- [ ] Backend deployed to Render/Railway/Heroku
- [ ] Environment variables set
- [ ] API endpoints responding
- [ ] Health check passing
- [ ] Copy backend URL for frontend

## 🔗 **Next Steps**

After backend deployment:
1. **Update frontend environment** with backend URL
2. **Deploy frontend to Vercel**
3. **Test the complete application**

## 🆘 **Troubleshooting**

### **Common Issues:**
- **Build fails**: Check Node.js version compatibility
- **Environment variables**: Ensure JSON is properly escaped
- **Google Sheets API**: Verify credentials and permissions
- **CORS errors**: Backend has CORS enabled

### **Need Help?**
- Check Render logs in dashboard
- Verify environment variables
- Test API endpoints individually
- Check Google Sheets API quotas
