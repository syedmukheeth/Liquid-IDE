import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, History, Code, Calendar, CheckCircle2, XCircle, ChevronRight, Play, Database
} from "lucide-react";
import ENDPOINTS from "../services/endpoints";

export default function HistoryModal({ isOpen, onClose, onRestore }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${ENDPOINTS.API_BASE_URL}/api/runs/history`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("sam_token") || ""}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", { 
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0e131e]/90 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white">
                  <History className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-white sam-headline">Compilation History</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Review and restore previous code snippets</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="rounded-xl p-2 text-white/20 transition-all hover:bg-white/5 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-4 md:p-8 scrollbar-hide">
              {loading ? (
                <div className="flex h-40 flex-col items-center justify-center gap-4">
                   <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Fetching records...</span>
                </div>
              ) : history.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-4">
                   <Database className="h-10 w-10 text-white/5" />
                   <div className="text-center">
                     <p className="text-sm font-bold text-white/20">No compilation history found.</p>
                     <p className="text-[10px] text-white/10 uppercase tracking-widest mt-1">Run some code to see your history here.</p>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {history.map((run) => (
                    <div 
                      key={run._id}
                      className="group relative flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05] hover:border-white/20"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${run.status === 'succeeded' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/30'}`}>
                           {run.status === 'succeeded' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{run.runtime || run.language}</span>
                             <span className="h-1 w-1 rounded-full bg-white/10" />
                             <span className="text-[10px] font-medium text-white/30">{formatDate(run.createdAt)}</span>
                          </div>
                          <div className="mt-1 truncate text-[11px] font-mono text-white/40 opacity-80">
                             {run.files?.[0]?.content?.substring(0, 60) || "Code snippet unavailable..."}...
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          const code = run.files?.[0]?.content || "";
                          onRestore(code, run.runtime || run.language);
                          onClose();
                        }}
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/10 text-white opacity-0 transition-all hover:bg-white hover:text-black group-hover:opacity-100 shadow-lg shadow-white/5"
                        title="Restore Code"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 bg-white/[0.02] p-6 text-center">
               <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">SAM Compiler Persistent Storage v2.1</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
