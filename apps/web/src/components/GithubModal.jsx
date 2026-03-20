import React, { useState } from "react";
import Modal from "./Modal";

export default function GithubModal({ isOpen, onClose, code, language, isDarkMode }) {
  const [token, setToken] = useState(localStorage.getItem("gh_token") || "");
  const [repo, setRepo] = useState(localStorage.getItem("gh_repo") || "");
  const [path, setPath] = useState(localStorage.getItem("gh_path") || "solution.txt");
  const [message, setMessage] = useState("Update via LiquidIDE");
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState(null);

  const onPush = async () => {
    setStatus("Pushing...");
    setError(null);
    localStorage.setItem("gh_token", token);
    localStorage.setItem("gh_repo", repo);
    localStorage.setItem("gh_path", path);

    try {
      const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
      const res = await fetch(`${API_URL}/github/push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, repo, path, content: code, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Success!");
        setTimeout(() => onClose(), 2000);
      } else {
        setError(data.message || "Failed to push to GitHub");
        setStatus("Failed");
      }
    } catch (err) {
      setError(err.message);
      setStatus("Failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Push to GitHub" isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Personal Access Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-[13px] text-white outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Repository Name</label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="my-cool-repo"
                className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-[13px] text-white outline-none focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">File Path</label>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="src/main.py"
                className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-[13px] text-white outline-none focus:border-blue-500/50"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Commit Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-[13px] text-white outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        {error && <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-[11px] font-bold text-rose-500">{error}</div>}

        <button
          onClick={onPush}
          disabled={status === "Pushing..."}
          className="flux-button-primary w-full py-4 text-[11px] font-black uppercase tracking-widest animate-shimmer"
        >
          {status === "Pushing..." ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span>Sycing with GitHub...</span>
            </div>
          ) : (
            "Push to Repository"
          )}
        </button>
      </div>
    </Modal>
  );
}
