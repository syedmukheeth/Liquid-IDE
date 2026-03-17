# Deploying LiquidIDE to Render.com (Monorepo Fix 2.0)

Render is having trouble finding the build tools (like `vite`). This is common in Monorepos.

### 🚀 Updated Deployment Instructions

#### 1. API & Worker
These usually work fine, but if you see errors, use:
- **Build Command**: `npm install`
- **Start Command**: `npm start -w @liquidide/api` (for API) or `npm start -w @liquidide/worker` (for Worker)

#### 2. Frontend (Static Site) - CRITICAL FIX
If you see **"vite: not found"**, use these exact settings:
- **Root Directory**: (Leave EMPTY)
- **Build Command**: `npm install && npm run build -w @liquidide/web`
- **Publish Directory**: `apps/web/dist`

---

### 🛠️ What I've Fixed
1. **Root Tools**: I've added `vite` and other build tools to the **root** of your project so Render can find them easily regardless of where the command starts.
2. **Commit Hash**: Render is now pulling the latest code (`1c91cd22...`).

### 📦 Pushed to GitHub
I have pushed the "Root Tool" addition. 

**Next Step**: 
Please go to Render and ensure your **Build Command** for the static site is exactly:
`npm install && npm run build -w @liquidide/web`
