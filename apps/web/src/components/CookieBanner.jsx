import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("sam_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("sam_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] mx-auto max-w-xl"
        >
          <div className="sam-glass flex flex-col items-center gap-4 border border-white/5 bg-black/80 px-6 py-4 backdrop-blur-2xl md:flex-row shadow-2xl rounded-2xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <Cookie className="h-5 w-5 text-white/40" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <p className="text-[11px] font-medium leading-relaxed text-white/60">
                We use cookies to improve your workspace experience and session persistence. By using SAM, you agree to our <a href="/privacy" className="text-white hover:underline">Privacy Policy</a>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAccept}
                className="rounded-xl bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-black transition-transform hover:scale-105 active:scale-95"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-xl bg-white/5 p-2 text-white/20 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
