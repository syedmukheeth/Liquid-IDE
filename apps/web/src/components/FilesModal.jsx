import React from "react";
import Modal from "./Modal";

const languageConfigs = {
  cpp: { name: "solution.cpp", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  c: { name: "solution.c", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
  python: { name: "solution.py", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  javascript: { name: "solution.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  java: { name: "Solution.java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" }
};

export default function FilesModal({ isOpen, onClose, isDarkMode, buffers, activeLangId, onSwitch, onPushFile }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Files" isDarkMode={isDarkMode}>
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid gap-3">
          {Object.entries(languageConfigs).map(([id, cfg]) => {
            const hasContent = buffers[id] && buffers[id].trim().length > 0;
            const isActive = id === activeLangId;
            
            return (
              <div 
                key={id}
                className={`group flex items-center justify-between rounded-2xl border p-4 transition-all ${isActive ? "border-blue-500/50 bg-blue-500/5" : isDarkMode ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]" : "border-slate-100 bg-slate-50/50 hover:bg-white"}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl p-2 ${isDarkMode ? "bg-white/5" : "bg-slate-100"}`}>
                    <img src={cfg.icon} alt={id} className="h-full w-full object-contain" />
                  </div>
                  <div className="space-y-0.5">
                    <p className={`text-[12px] font-black uppercase tracking-wider ${isDarkMode ? "text-white/90" : "text-slate-800"}`}>
                      {cfg.name}
                      {isActive && <span className="ml-2 text-[8px] text-blue-400 font-bold border border-blue-400/30 px-1.5 py-0.5 rounded-full uppercase">Active</span>}
                    </p>
                    <p className={`text-[9px] font-bold ${isDarkMode ? "text-white/30" : "text-slate-400"}`}>
                      {hasContent ? `${buffers[id].split('\n').length} lines of code` : "Empty template"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   {!isActive && (
                     <button 
                        onClick={() => { onSwitch(id); onClose(); }}
                        className={`rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${isDarkMode ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`}
                      >
                        Switch
                      </button>
                   )}
                   <button 
                    onClick={() => { onPushFile(id); onClose(); }}
                    className={`rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${isDarkMode ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-emerald-500 text-white hover:brightness-110"}`}
                  >
                    Push
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
