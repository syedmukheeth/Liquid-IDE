import React from "react";
import { Sparkles, Settings, FolderOpen, Search, GitBranch, Cpu } from "lucide-react";

// SAM Compiler logo glyph — inline SVG
function SamLogo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SAM Compiler"
    >
      <rect width="36" height="36" rx="10" fill="url(#samGrad)" />
      {/* Circuit trace lines */}
      <path d="M8 18 H12 M24 18 H28" stroke="#001f27" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M18 8 V12 M18 24 V28" stroke="#001f27" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* S letterform */}
      <path
        d="M22 11.5C20.8 10.5 19.2 10 17.5 10C14.5 10 12 11.8 12 14.2C12 16.4 13.8 17.5 16.5 18.2L17.5 18.5C20.2 19.2 22 20.3 22 22.5C22 25 19.5 26.5 16.8 26.5C14.8 26.5 12.8 25.8 11.5 24.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <linearGradient id="samGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const navItems = [
  { id: "files",    icon: FolderOpen,  label: "Files" },
  { id: "search",   icon: Search,      label: "Search" },
  { id: "git",      icon: GitBranch,   label: "Source Control" },
  { id: "ai",       icon: Sparkles,    label: "SAM AI" },
];

export default function ActivityBar({ onOpenAI, aiActive, onOpenSettings }) {
  const [activeNav, setActiveNav] = React.useState("files");

  const handleNav = (id) => {
    setActiveNav(id);
    if (id === "ai") onOpenAI?.();
  };

  return (
    <div
      className="hidden md:flex flex-col items-center gap-4 py-4 px-2 shrink-0 sam-glass rounded-[14px] border-r border-[#00D4FF]/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative z-30"
      style={{
        width: 60,
        background: "rgba(8,14,24,0.6)",
      }}
    >
      {/* Top Edge Glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent" />

      {/* SAM Logo */}
      <button
        className="mb-4 transition-transform hover:scale-110 hover:brightness-110 active:scale-95"
        title="SAM Compiler"
        onClick={() => {}}
      >
        <SamLogo size={36} />
      </button>

      {/* Nav icons */}
      <div className="flex flex-1 flex-col gap-2 w-full">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = id === "ai" ? aiActive : activeNav === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              title={label}
              className="relative flex h-11 w-full items-center justify-center rounded-xl transition-all duration-300 group overflow-hidden"
              style={{
                background: isActive
                  ? "rgba(0,212,255,0.15)"
                  : "transparent",
                color: isActive
                  ? "#00D4FF"
                  : "rgba(221,226,241,0.3)",
                boxShadow: isActive ? "inset 0 0 12px rgba(0,212,255,0.1)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(0,212,255,0.06)";
                  e.currentTarget.style.color = "rgba(0,212,255,0.7)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(221,226,241,0.3)";
                }
              }}
            >
              <div 
                className={`absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-full bg-[#00D4FF] shadow-[0_0_12px_#00D4FF] transition-all duration-300 ${isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`} 
              />
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`transition-all duration-300 ${isActive && id === 'ai' ? 'animate-pulse drop-shadow-[0_0_8px_#00D4FF]' : ''}`}
              />
            </button>
          );
        })}
      </div>

      {/* Settings */}
      <button
        onClick={onOpenSettings}
        title="Settings"
        className="relative flex h-11 w-full items-center justify-center rounded-xl transition-all duration-500 hover:bg-[#00D4FF]/5 hover:text-[#00D4FF] mt-auto"
        style={{ color: "rgba(221,226,241,0.3)" }}
      >
        <Settings size={20} className="transition-transform duration-500 hover:rotate-90" />
      </button>
    </div>
  );
}
