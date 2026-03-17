# Deploying LiquidIDE to Render.com (Monorepo Fix)

Because LiquidIDE is a **Monorepo**, Render needs to know exactly which sub-folder to build. 

### ⚠️ CRITICAL SETUP: DO NOT set a "Root Directory"
When creating your services on Render, leave the **Root Directory** field **EMPTY**. We will handle the folders using commands.

---

## 🚀 Correct Service Settings

### 1. API (Web Service)
- **Build Command**: `npm install`
- **Start Command**: `npm start -w @liquidide/api`
- **Environment Variables**:
  - `MONGO_URI`: (Your Atlas link)
  - `REDIS_URL`: (Your Upstash link)
  - `PORT`: `8080`
  - `WEB_ORIGIN`: `https://your-frontend.onrender.com`

---

### 2. Worker (Background Worker)
- **Build Command**: `npm install`
- **Start Command**: `npm start -w @liquidide/worker`
- **Environment Variables**:
  - `MONGO_URI`: (Same as API)
  - `REDIS_URL`: (Same as API)

---

### 3. Frontend (Static Site)
- **Build Command**: `npm install && npm run build -w @liquidide/web`
- **Publish Directory**: `apps/web/dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://your-api-url.onrender.com`

---

## 🛠️ Why did the previous build fail?
It failed because Render was trying to run `vite build` inside the `apps/web` folder without having the root dependencies installed. By using `-w @liquidide/web`, we tell npm to look at the whole project structure and find the right tools.

## 📦 Pushed Fix
I have updated the scripts and pushed them to your repository. You can now **Retry** your deploy on Render with these new settings!
