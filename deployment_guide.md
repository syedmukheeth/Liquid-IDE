# Deploying LiquidIDE to Render.com

Since you've chosen **Render**, here is the exact step-by-step plan to get your IDE live.

## 🏁 Prerequisites Checklist
- [x] **MongoDB Atlas**: Configured (`MONGO_URI` in your `.env`)
- [x] **Upstash Redis**: Configured (`REDIS_URL` in your `.env`)
- [x] **GitHub Repo**: Connected to Render

---

## 🚀 Deployment Steps

### 1. Deploy the API (Web Service)
This handles all the code running requests.
- **Service Type**: Web Service
- **Language**: Node
- **Root Directory**: `apps/api`
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js`
- **Environment Variables**:
  - `MONGO_URI`: (Paste your Atlas link)
  - `REDIS_URL`: (Paste your Upstash link)
  - `PORT`: `8080`
  - `WEB_ORIGIN`: `https://your-frontend-url.onrender.com`

### 2. Deploy the Worker (Background Worker)
This is what actually executes the code.
- **Service Type**: Background Worker
- **Language**: Node
- **Root Directory**: `apps/worker`
- **Build Command**: `npm install`
- **Start Command**: `node src/worker.js`
- **Environment Variables**:
  - `MONGO_URI`: (Same as API)
  - `REDIS_URL`: (Same as API)

### 3. Deploy the Frontend (Static Site)
The premium "Liquid Flux" user interface.
- **Service Type**: Static Site
- **Root Directory**: `apps/web`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://your-api-url.onrender.com`

---

## ⚠️ Important Note on Docker
Render's **Free Tier** Background Workers do not officially support running `docker` inside them. 
**Don't worry!** I have already implemented a **Local Fallback** for you. Because you are on Windows/Render, the IDE will automatically use the host's compilers (like `node` and `g++`) to run the code if Docker isn't available.

## 📦 Final Push
I have updated your files and pushed them to GitHub. You can now go to [dashboard.render.com](https://dashboard.render.com) and link your repository!
