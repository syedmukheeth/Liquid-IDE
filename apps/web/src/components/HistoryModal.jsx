import React from "react";
import Modal from "./Modal";

export default function HistoryModal({ isOpen, onClose, isDarkMode, history = [], onRestore }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Code Execution History" isDarkMode={isDarkMode}>
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-20 opacity-20 grayscale">
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-[11px] font-black uppercase tracking-[0.4em]">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div 
                key={index}
                className={`group flex items-center justify-between rounded-2xl border p-5 transition-all hover:scale-[1.02] active:scale-[0.98] ${isDarkMode ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]" : "border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50"}`}
              >
                <div className="flex items-center gap-6">
                   <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-black text-[10px] uppercase transition-colors ${isDarkMode ? "bg-white/5 text-white/40 group-hover:bg-blue-500/20 group-hover:text-blue-400" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"}`}>
                      {item.language.slice(0, 2)}
                   </div>
                   <div className="space-y-1">
                      <p className={`text-[12px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/80" : "text-slate-800"}`}>Run at {new Date(item.timestamp).toLocaleTimeString()}</p>
                      <p className={`text-[9px] font-bold ${isDarkMode ? "text-amber-500/40" : "text-slate-400"}`}>{item.code.slice(0, 30)}...</p>
                   </div>
                </div>
                <button 
                  onClick={() => { onRestore(item.code, item.languageId); onClose(); }}
                  className={`rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" : "bg-blue-500 text-white hover:brightness-110"}`}
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
