# 🚀 SAM Compiler - Official Guide & Contribution Handbook

Welcome to the **SAM Compiler**! Whether you are a user looking to maximize your productivity or a developer wanting to contribute to this cutting-edge IDE, this guide contains absolutely everything you need.

## 📖 Table of Contents
1. [How to Use the SAM Compiler](#-how-to-use-the-sam-compiler)
2. [Developer Setup & Architecture](#-developer-setup--architecture)
3. [How to Contribute](#-how-to-contribute)
4. [Code of Conduct](#-code-of-conduct)

---

## 🛠 How to Use the SAM Compiler

SAM Compiler is designed to be a frictionless, zero-setup collaborative coding environment with deep AI integration.

### Core Features
- **Multi-Language Support**: Drop down the language selector in the top left to instantly switch between JavaScript, Python, C++, Java, and more.
- **The AI Panel**: Click the **✨ Sparkles** icon in the header to awaken Sam AI. Sam can explain complex bugs, optimize your current logic, or write entirely new functions directly into your editor context.
- **Global Execution History**: Click the **🕒 History** icon to view past code runs. If you accidentally delete a working iteration of your script, you can easily load it back from the cloud.
- **Keyboard Shortcuts**: Power users should leverage our custom keybindings. Press `Ctrl + /` to instantly toggle the AI. Press `Ctrl + Enter` to compile.

### Authentication
To save your code history or increase your execution rate limits, sign in via your Google or GitHub account using the **Sign In** button in the header. All sessions are securely tokenized with HTTP-Only cookies.

---

## 💻 Developer Setup & Architecture

### The Stack
- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion, Monaco Editor.
- **Backend**: Node.js, Express, Socket.io, Passport.js, Piston API.
- **Database**: MongoDB Atlas.

### Local Installation
To get a local instance of the SAM Compiler running on your machine:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/syedmukheeth/Liquid-IDE.git
   cd Liquid-IDE
   ```

2. **Install Dependencies**
   We use a monorepo-style split, so you need to install dependencies for both the frontend (`web`) and backend (`api`).
   ```bash
   cd apps/api && npm install
   cd ../web && npm install
   ```

3. **Environment Variables**
   Create a `.env` file in `apps/api/`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongo_cluster_connection_string
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GITHUB_CLIENT_ID=your_github_oauth_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
   FRONTEND_URL=http://localhost:5173
   SESSION_SECRET=super_secret_sam_key
   ```
   Create a `.env` file in `apps/web/`:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_WS_URL=http://localhost:5000
   ```

4. **Booting the Engines**
   Start the backend (from `apps/api`):
   ```bash
   npm run dev
   ```
   Start the frontend (from `apps/web`):
   ```bash
   npm run dev
   ```
   Your compiler will be running brilliantly at `localhost:5173`!

---

## 🤝 How to Contribute

We actively welcome pull requests from the community! From bug fixes to feature additions, we want SAM to be built by developers, for developers.

### Contribution Workflow
1. **Fork the Repository**: Click the 'Fork' button at the top right of this page.
2. **Create a Branch**: 
   ```bash
   git checkout -b feature/amazing-new-idea
   ```
3. **Make Your Changes**: Follow the core principles of our UI (Tailwind `sam-` classes).
4. **Test Thoroughly**: Ensure that the compiler correctly executes code and websocket connections do not drop.
5. **Commit Your Changes**: We prefer conventional commits!
   ```bash
   git commit -m "feat(ui): add amazing new idea directly to the engine"
   ```
6. **Push to Your Fork**:
   ```bash
   git push origin feature/amazing-new-idea
   ```
7. **Open a Pull Request**: Submit the PR against our `main` branch.

### UI/UX Design System Rules
If you are contributing to the frontend, please adhere strictly to our "Monolith Obsidian" design system:
- **Colors**: Never hardcode colors. Always use CSS variables (`var(--sam-bg)`, `var(--sam-accent)`).
- **Glassmorphism**: Use the `.sam-glass` and `.noise-overlay` classes to maintain the premium backdrop filter aesthetic.
- **Responsiveness**: Ensure every new component hides gracefully on `md:hidden` or breaks down appropriately for mobile screens.

---

## 🛡 Code of Conduct
We expect all community members to interact with respect and professionalism. Constructive feedback in issues and PRs is encouraged, but toxic behavior will not be tolerated. Keep the code clean and the discussions highly technical.
