# LiquidIDE Deployment Guide: Cloud-Native Execution 🚀

To achieve a professional, cloud-only experience (like Programiz) where you don't need to run a local worker for C++, Java, or C, you must deploy the API as a **Docker Container**.

## Why Docker?
Vercel Serverless is great for JS/Node, but it **does not contain compilers** (g++, gcc). Our Dockerfile is pre-configured with all these tools, allowing the API to execute code directly in the cloud.

---

## Option 1: Render (Recommended)
Render is the easiest way to deploy a Dockerized monorepo.

1.  **Create a New Web Service** on Render.
2.  **Connect your GitHub Repository**.
3.  **Root Directory**: Leave as root or set to `apps/api` (if you only want the API).
4.  **Language**: Select **Docker**.
5.  **Docker Command**: Render will automatically find the `Dockerfile` in `apps/api`.
6.  **Environment Variables**:
    *   `PORT`: 5000
    *   `MONGODB_URI`: Your MongoDB Connection String
    *   `REDIS_URL`: Your Redis Connection String (Upstash/Aiven)
    *   `NODE_ENV`: production

---

## Option 2: Railway
Railway is also excellent for monorepos.

1.  **New Project** -> **Deploy from GitHub**.
2.  Railway will detect the `Dockerfile`.
3.  In **Settings**, ensure the **Root Directory** is set to `apps/api`.
4.  Add your Environment Variables.

---

## Option 3: Local "Hybrid" Mode (Current)
If you prefer to stay on Vercel, you **must** run the worker on your local machine to handle compiled languages:

```bash
cd apps/worker
npm start
```

Ensure your `REDIS_URL` is the same for both the Vercel API and your local worker.

---

## Verifying Cloud Execution
Once deployed on a container platform, try running this C++ code:
```cpp
#include <iostream>
int main() {
    std::cout << "Hello from the Cloud!" << std::endl;
    return 0;
}
```
---

## 🔐 Authentication & Environment Variables

For social logins and full functionality, ensure the following environment variables are set in your production environment (Vercel/Render/Railway).

### Social Auth Setup (GitHub & Google)
1. **GitHub**: Create an OAuth App in [GitHub Developer Settings](https://github.com/settings/developers).
2. **Google**: Create OAuth Credentials in [Google Cloud Console](https://console.cloud.google.com).
3. Set the redirect URIs to `https://<YOUR_API_DOMAIN>/auth/github/callback` (and Google).

### Required Environment Variables
```env
# Core
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://...
WEB_ORIGIN=https://<YOUR_FRONTEND_DOMAIN>
JWT_SECRET=your_super_secret_jwt_key

# Execution (Redis for Workers)
REDIS_URL=rediss://...

# Social Auth
CALLBACK_URL_BASE=https://<YOUR_API_DOMAIN>/auth
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

<div align="center">
  <b>LiquidIDE Deployment Guide</b><br>
  <i>Ensuring a seamless, professional cloud-hosting experience.</i>
</div>
