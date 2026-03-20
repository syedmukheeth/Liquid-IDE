# LiquidIDE Deployment Guide: Cloud-Native Execution 🚀

To achieve a professional, cloud-only experience (like Programiz) where you don't need to run a local worker for C++, Java, Go, or Rust, you must deploy the API as a **Docker Container**.

## Why Docker?
Vercel Serverless is great for JS/Node, but it **does not contain compilers** (g++, gcc, go). Our Dockerfile is pre-configured with all these tools, allowing the API to execute code directly in the cloud.

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
If you see "Compiling program..." followed by the output without the "Worker" message, you are running 100% in the cloud! 💎🏆
