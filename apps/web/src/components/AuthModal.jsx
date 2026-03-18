import React, { useState } from "react";
import Modal from "./Modal";

export default function AuthModal({ isOpen, onClose, isDarkMode, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(null); // 'github', 'google', 'email'

  const handleSocialLogin = (provider) => {
    setIsLoading(provider);
    // Simulate API delay
    setTimeout(() => {
      onLogin({
        name: "Syed Mukheeth",
        email: "syed@example.com",
        avatar: provider === 'github' 
          ? "https://avatars.githubusercontent.com/u/9919?v=4" 
          : "https://lh3.googleusercontent.com/a/ACg8ocL8",
        provider
      });
      setIsLoading(null);
      onClose();
    }, 1500);
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    setIsLoading('email');
    setTimeout(() => {
      onLogin({
        name: "Liquid User",
        email: "user@liquid.com",
        avatar: "https://ui-avatars.com/api/?name=Liquid+User&background=6366f1&color=fff",
        provider: 'email'
      });
      setIsLoading(null);
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isLogin ? "Sign In to Flux" : "Create Flux Account"} isDarkMode={isDarkMode}>
      <form onSubmit={handleEmailAuth} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/30" : "text-slate-400"}`}>Email Address</label>
            <input 
              required
              type="email" 
              placeholder="name@example.com"
              className={`w-full rounded-2xl border px-6 py-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode ? "border-white/5 bg-white/5 text-white placeholder:text-white/10" : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-300"}`}
            />
          </div>
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/30" : "text-slate-400"}`}>Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              className={`w-full rounded-2xl border px-6 py-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode ? "border-white/5 bg-white/5 text-white placeholder:text-white/10" : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-300"}`}
            />
          </div>
        </div>

        <button 
          disabled={!!isLoading}
          className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-[12px] font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-500/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          {isLoading === 'email' ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span>Authenticating...</span>
            </div>
          ) : (
            isLogin ? "Sign In" : "Create Account"
          )}
        </button>

        <div className="flex items-center gap-4 py-2">
          <div className={`h-px flex-1 ${isDarkMode ? "bg-white/5" : "bg-slate-100"}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/10" : "text-slate-300"}`}>Or continue with</span>
          <div className={`h-px flex-1 ${isDarkMode ? "bg-white/5" : "bg-slate-100"}`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => handleSocialLogin('github')}
            disabled={!!isLoading}
            className={`flex items-center justify-center gap-3 rounded-2xl border py-4 transition-all active:scale-95 disabled:opacity-50 ${isDarkMode ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-white hover:bg-slate-50 shadow-sm"}`}
          >
            {isLoading === 'github' ? (
               <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/20 border-t-current" />
            ) : (
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" className={`h-5 w-5 ${isDarkMode ? "invert" : ""}`} alt="GitHub" />
            )}
            <span className="text-[11px] font-black uppercase tracking-widest opacity-80">GitHub</span>
          </button>
          <button 
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={!!isLoading}
            className={`flex items-center justify-center gap-3 rounded-2xl border py-4 transition-all active:scale-95 disabled:opacity-50 ${isDarkMode ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-white hover:bg-slate-50 shadow-sm"}`}
          >
            {isLoading === 'google' ? (
               <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/20 border-t-current" />
            ) : (
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" className="h-5 w-5" alt="Google" />
            )}
            <span className="text-[11px] font-black uppercase tracking-widest opacity-80">Google</span>
          </button>
        </div>

        <p className={`text-center text-[11px] font-bold ${isDarkMode ? "text-white/20" : "text-slate-400"}`}>
          {isLogin ? "New to Flux?" : "Already have an account?"}{" "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:text-blue-400 underline underline-offset-4 transition-colors font-black"
          >
            {isLogin ? "Create an account" : "Sign in here"}
          </button>
        </p>
      </form>
    </Modal>
  );
}
