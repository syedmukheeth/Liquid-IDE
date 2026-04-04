import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const languages = [
  { id: "cpp",        label: "C++",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { id: "c",          label: "C",          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
  { id: "python",     label: "Python",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { id: "javascript", label: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { id: "java",       label: "Java",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
];

export default function LanguageSelector({ activeLanguage, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedLang = languages.find((l) => l.id === activeLanguage) || languages[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="language-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.04)",
          transition: "all 0.25s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.09)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
        }}
      >
        <img
          src={selectedLang.icon}
          alt={selectedLang.label}
          style={{ width: 16, height: 16, objectFit: "contain", flexShrink: 0 }}
        />
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#dde2f1",
          letterSpacing: "0.03em",
          fontFamily: "var(--font-body)",
        }}>
          {selectedLang.label}
        </span>
        <ChevronDown
          size={12}
          style={{
            color: "#FFFFFF",
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.25s",
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            minWidth: 180,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(14,19,30,0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255,255,255,0.05)",
            zIndex: 60,
            padding: 6,
            animation: "fadeInDown 0.18s ease",
          }}
        >
          {languages.map((lang) => {
            const isActive = activeLanguage === lang.id;
            return (
              <button
                key={lang.id}
                id={`lang-option-${lang.id}`}
                onClick={() => { onLanguageChange(lang.id); setIsOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: isActive ? "rgba(255,255,255,0.10)" : "transparent",
                  color: isActive ? "#FFFFFF" : "rgba(221,226,241,0.5)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                  fontFamily: "var(--font-body)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "#dde2f1";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(221,226,241,0.5)";
                  }
                }}
              >
                <img src={lang.icon} alt={lang.label} style={{ width: 18, height: 18, objectFit: "contain" }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{lang.label}</span>
                {isActive && (
                  <div style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    boxShadow: "0 0 8px white",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
