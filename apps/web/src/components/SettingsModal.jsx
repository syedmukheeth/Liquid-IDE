import React, { useState } from "react";
import Modal from "./Modal";

export default function SettingsModal({ isOpen, onClose, isDarkMode, settings, onSettingsChange }) {
  const [activeTab, setActiveTab] = useState("editor");

  const tabs = [
    { id: "editor", label: "Editor", icon: "M14.318 18.222a7.5 7.5 0 000-10.606M11.485 15.39a4.5 4.5 0 000-6.364m-4.582 4.59a1.5 1.5 0 000-2.122m3.106 3.11a.5.5 0 000-.708M14.318 18.222a7.5 7.5 0 000-10.606" },
    { id: "account", label: "Account", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "engine", label: "Flux Engine", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Flux System Settings" isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Tab Navigation */}
        <div className={`flex items-center gap-2 rounded-2xl p-1.5 transition-colors ${isDarkMode ? "bg-white/5" : "bg-slate-100"}`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? (isDarkMode ? "bg-white/10 text-white shadow-lg" : "bg-white text-slate-900 shadow-sm") : "text-white/20 hover:text-white/40"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8 min-h-[300px]">
          {activeTab === "editor" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className={`text-[12px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/80" : "text-slate-700"}`}>Font Size</p>
                  <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/20" : "text-slate-400"}`}>Adjust font size for the editor</p>
                </div>
                <input 
                  type="number" 
                  value={settings.fontSize || 14}
                  onChange={(e) => onSettingsChange({ ...settings, fontSize: parseInt(e.target.value) })}
                  className={`w-20 rounded-xl border px-4 py-2 text-center text-[12px] font-black transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode ? "border-white/5 bg-white/5 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}
                />
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className={`text-[12px] font-black uppercase tracking-widest ${isDarkMode ? "text-white/80" : "text-slate-700"}`}>Tab Size</p>
                  <p className={`text-[10px] font-bold ${isDarkMode ? "text-white/20" : "text-slate-400"}`}>Number of spaces per indentation</p>
                </div>
                <select 
                   value={settings.tabSize || 2}
                   onChange={(e) => onSettingsChange({ ...settings, tabSize: parseInt(e.target.value) })}
                   className={`w-20 rounded-xl border px-4 py-2 text-center text-[12px] font-black transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode ? "border-white/5 bg-white/5 text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="flex flex-col items-center justify-center gap-8 py-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-2xl shadow-blue-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-black/20 backdrop-blur-xl font-black text-white text-3xl">G</div>
              </div>
              <div className="text-center space-y-2">
                <p className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-800"}`}>Guest User</p>
                <div className="inline-flex rounded-lg bg-amber-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-amber-500 ring-1 ring-amber-500/20">Free Tier</div>
              </div>
              <button className="rounded-2xl bg-white/5 border border-white/5 px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95">Upgrade to PRO</button>
            </div>
          )}

          {activeTab === "engine" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="rounded-2xl bg-blue-500/5 border border-blue-500/10 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400">Engine V0.2.2-Stable</p>
                  </div>
                  <p className={`text-[10px] font-bold leading-6 ${isDarkMode ? "text-white/40" : "text-slate-400"}`}>
                    Connected to Flux-Cluster-A (Frankfurt). Execution latency: 42ms. 
                    Your current execution limits: 512MB RAM, 10s Time Limit.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
