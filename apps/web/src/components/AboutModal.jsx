import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Linkedin, ExternalLink, ShieldCheck } from "lucide-react";
import OfficialLogo from "./OfficialLogo";

export default function AboutModal({ isOpen, onClose, theme = "dark" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className={`relative w-full max-w-sm overflow-hidden rounded-[32px] border p-8 shadow-2xl backdrop-blur-2xl ${
            theme === 'dark' ? 'border-white/10 bg-black/95' : 'border-slate-200 bg-white/95'
          }`}
        >
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full p-2 text-white/20 hover:bg-white/5 hover:text-white transition-all"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center text-center">
            <OfficialLogo theme={theme} size={64} className="mb-6" />
            
            <h2 className={`text-lg font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              SAM COMPILER
            </h2>
            <p className={`mt-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>
              Syntax Analysis Machine v2.4
            </p>

            <div className="my-8 h-[1px] w-full bg-white/5" />

            <div className="space-y-6 w-full">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Architect & Developer</span>
                <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Syed Mukheeth
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                <a 
                  href="https://linkedin.com/in/syedmukheeth" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl bg-[#0077b5]/10 border border-[#0077b5]/20 p-4 transition-all hover:bg-[#0077b5] group"
                >
                  <div className="flex items-center gap-3 text-[#0077b5] group-hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Connect on LinkedIn</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#0077b5] group-hover:text-white transition-colors" />
                </a>

                <a 
                  href="https://github.com/syedmukheeth" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-4 transition-all hover:bg-white hover:text-black group"
                >
                  <div className="flex items-center gap-3 text-white transition-colors group-hover:text-black">
                    <Github className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Follow on GitHub</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white group-hover:text-black transition-colors" />
                </a>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 opacity-30">
              <ShieldCheck className="h-3 w-3" />
              <span className="text-[8px] font-bold uppercase tracking-widest">Hardened Runtime | Enterprise Grade</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
