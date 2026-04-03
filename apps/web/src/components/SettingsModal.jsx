import React, { useState } from "react";
import Modal from "./Modal";
import { Cpu, Settings, User } from "lucide-react";

export default function SettingsModal({ isOpen, onClose, isDarkMode, settings, onSettingsChange }) {
  const [activeTab, setActiveTab] = useState("editor");

  const tabs = [
    { id: "editor",  label: "Editor",  Icon: Settings },
    { id: "account", label: "Account", Icon: User },
    { id: "engine",  label: "Engine",  Icon: Cpu },
  ];

  const handleChange = (key, value) => onSettingsChange({ ...settings, [key]: value });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SAM Compiler Settings">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Tab bar */}
        <div style={{
          display: "flex",
          gap: 4,
          padding: 4,
          borderRadius: 10,
          background: "rgba(0,212,255,0.04)",
          border: "1px solid rgba(0,212,255,0.1)",
        }}>
          {tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                id={`settings-tab-${id}`}
                onClick={() => setActiveTab(id)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "8px 0",
                  borderRadius: 7,
                  border: "none",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  background: active ? "rgba(0,212,255,0.12)" : "transparent",
                  color: active ? "#00D4FF" : "rgba(221,226,241,0.3)",
                  boxShadow: active ? "0 0 12px rgba(0,212,255,0.2)" : "none",
                  fontFamily: "var(--font-body)",
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Editor Tab */}
        {activeTab === "editor" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Font Size */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#dde2f1", fontFamily: "var(--font-body)", marginBottom: 4 }}>Font Size</p>
                <p style={{ fontSize: 10, color: "rgba(221,226,241,0.3)", fontFamily: "var(--font-body)" }}>Editor text size in pixels</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {["-", "+"].map((op) => (
                  <button
                    key={op}
                    id={`font-size-${op === "-" ? "dec" : "inc"}`}
                    onClick={() => handleChange("fontSize", op === "-"
                      ? Math.max(10, (settings.fontSize || 14) - 1)
                      : Math.min(32, (settings.fontSize || 14) + 1)
                    )}
                    style={{
                      width: 32, height: 32,
                      borderRadius: 8,
                      border: "1px solid rgba(0,212,255,0.15)",
                      background: "rgba(0,212,255,0.05)",
                      color: "#00D4FF",
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                  >{op}</button>
                ))}
                <span style={{ fontSize: 16, fontWeight: 800, color: "#00D4FF", minWidth: 28, textAlign: "center", fontFamily: "var(--font-mono)" }}>
                  {settings.fontSize || 14}
                </span>
              </div>
            </div>

            <div className="sam-divider" />

            {/* Tab Size */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#dde2f1", fontFamily: "var(--font-body)", marginBottom: 4 }}>Tab Size</p>
                <p style={{ fontSize: 10, color: "rgba(221,226,241,0.3)", fontFamily: "var(--font-body)" }}>Spaces per indentation level</p>
              </div>
              <div style={{ display: "flex", gap: 6, padding: 4, borderRadius: 8, background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }}>
                {[2, 4, 8].map(size => (
                  <button
                    key={size}
                    id={`tab-size-${size}`}
                    onClick={() => handleChange("tabSize", size)}
                    style={{
                      width: 36, height: 32,
                      borderRadius: 6,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: settings.tabSize === size ? "rgba(0,212,255,0.15)" : "transparent",
                      color: settings.tabSize === size ? "#00D4FF" : "rgba(221,226,241,0.3)",
                      boxShadow: settings.tabSize === size ? "0 0 10px rgba(0,212,255,0.2)" : "none",
                      fontFamily: "var(--font-mono)",
                    }}
                  >{size}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "20px 0" }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #00D4FF, #8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 30px rgba(0,212,255,0.35)",
              fontSize: 32, fontWeight: 900, color: "#001f27",
              fontFamily: "var(--font-display)",
            }}>S</div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#dde2f1", fontFamily: "var(--font-display)", marginBottom: 8 }}>
                SAM Compiler Member
              </p>
              <span style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: 20,
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)",
                fontSize: 10, fontWeight: 700,
                color: "#00D4FF",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily: "var(--font-body)",
              }}>Free Tier</span>
            </div>
            <button style={{
              padding: "12px 32px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #00D4FF, #8B5CF6)",
              color: "#001f27",
              fontSize: 11, fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              cursor: "pointer",
              boxShadow: "0 0 18px rgba(0,212,255,0.4)",
              fontFamily: "var(--font-body)",
            }}>
              Upgrade to SAM Pro
            </button>
          </div>
        )}

        {/* Engine Tab */}
        {activeTab === "engine" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              padding: 20,
              borderRadius: 12,
              background: "rgba(0,212,255,0.04)",
              border: "1px solid rgba(0,212,255,0.12)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e", animation: "sam-pulse 2s infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: "#00D4FF", textTransform: "uppercase", letterSpacing: "0.2em", fontFamily: "var(--font-body)" }}>
                  SAM Engine v1.0
                </span>
              </div>
              {[
                ["Connected to", "SAM-Cluster-Global"],
                ["Execution Limit", "60s • Unlimited RAM"],
                ["Sandbox", "Docker + Pyodide"],
                ["Status", "OPTIMIZED ✦"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: "rgba(221,226,241,0.35)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                  <span style={{ fontSize: 10, color: "#dde2f1", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
