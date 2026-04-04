import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Sparkles, X, Zap, RefreshCw, Copy, Check, Terminal, ExternalLink
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ENDPOINTS from "../services/endpoints";

export default function AiPanel({ 
  isOpen, 
  onClose, 
  currentCode, 
  language, 
  metrics,
  onApplyRefactor 
}) {
  const [messages, setMessages] = useState([
    { role: "model", content: "I am Sam AI, your elite coding partner. How can I accelerate your development today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${ENDPOINTS.API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: currentCode, language, messages: [...messages, userMsg] })
      });

      if (!response.ok) throw new Error("AI Service unavailable");

      const reader = response.body.getReader();
      const decoder = new window.TextDecoder();
      let assistantMsg = { role: "model", content: "" };
      setMessages(prev => [...prev, assistantMsg]);

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "");
            if (dataStr === "[DONE]") break;
            let parsed;
            try {
              parsed = JSON.parse(dataStr);
            } catch (e) {
              continue; // ignore incomplete chunks
            }
            if (parsed.error) throw new Error(parsed.error);
            assistantMsg.content += parsed.chunk;
            setMessages(prev => {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1] = { ...assistantMsg };
              return newMsgs;
            });
          }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", content: `❌ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefactor = async () => {
    setLoading(true);
    const query = "Refactor this code for maximum performance and professional industry standards.";
    setMessages(prev => [...prev, { role: "user", content: query }]);

    try {
      const res = await fetch(`${ENDPOINTS.API_BASE_URL}/api/ai/refactor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: currentCode, language, metrics, query })
      });
      const data = await res.json();
      if (data.refactor) {
        setMessages(prev => [...prev, { role: "model", content: data.refactor }]);
      }
    } catch (err) {
       setMessages(prev => [...prev, { role: "model", content: `❌ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeStr = String(children).replace(/\n$/, "");
      
      if (!inline && match) {
        return (
          <div className="group relative my-6">
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-[var(--sam-accent)] text-[var(--sam-bg)] text-[9px] font-black uppercase tracking-tighter rounded-md z-10">
              {match[1]}
            </div>
            <div className="rounded-2xl bg-black/60 border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
              <pre className="p-5 font-mono text-[12px] leading-relaxed text-white/80 overflow-x-auto scrollbar-hide">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
              <div className="flex items-center justify-end gap-2 border-t border-white/5 bg-white/[0.02] p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => navigator.clipboard.writeText(codeStr)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold text-white/40 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Copy size={12} /> Copy
                </button>
                <button 
                  onClick={() => onApplyRefactor(codeStr)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-[10px] font-bold text-white hover:bg-white hover:text-black transition-all"
                >
                  <Zap size={12} fill="currentColor" /> Apply
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <code className="bg-white/10 px-1.5 py-0.5 rounded-md font-mono text-white" {...props}>
          {children}
        </code>
      );
    },
    p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="mb-4 space-y-2 list-none">{children}</ul>,
    li: ({ children }) => (
      <li className="flex gap-3">
        <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        <span>{children}</span>
      </li>
    ),
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-white hover:underline hover:opacity-100 transition-colors"
      >
        {children} <ExternalLink size={10} />
      </a>
    ),
    h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-4 mt-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-bold text-white mb-3 mt-5">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base font-bold text-white mb-2 mt-4">{children}</h3>,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Mobile Only) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md md:hidden"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[65] h-screen w-full border-l border-white/5 bg-black shadow-[-20px_0_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl md:w-[450px] lg:w-[500px]"
          >
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
               <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-[80px]" />
            </div>

            <div className="relative flex h-full flex-col z-10">
              {/* Header */}
              <div className="flex h-20 items-center justify-between border-b border-white/5 px-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black shadow-lg shadow-white/10">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black tracking-tight text-white sam-headline">Sam AI</h2>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest opacity-90 text-label">
                       <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
                       Intelligence Active
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="rounded-xl p-2.5 text-white/30 transition-all hover:bg-white/5 hover:text-white hover:scale-110 active:scale-95">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="flex flex-col gap-8">
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className={`max-w-[95%] rounded-3xl px-5 py-4 text-[13px] leading-[1.6] shadow-xl ${
                        msg.role === "user" 
                          ? "bg-white/10 text-white border border-white/10 rounded-tr-none shadow-2xl" 
                          : "bg-white/5 text-white/90 border border-white/5 backdrop-blur-xl rounded-tl-none"
                      }`}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={MarkdownComponents}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex items-center gap-3 text-white/40 ml-2">
                       <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse" />
                       <span className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-70">Sam AI is thinking</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-white/5 p-8 bg-black/40 backdrop-blur-md">
                <div className="mb-5 flex flex-wrap gap-2.5">
                  <ChatQuickAction icon={<Zap />} label="Optimize" onClick={handleRefactor} />
                  <ChatQuickAction icon={<Check />} label="Fix Bugs" onClick={() => setInput("Identify and fix potential issues in this code.")} />
                  <ChatQuickAction icon={<Terminal />} label="Explain" onClick={() => setInput("Explain the logic used here in simple terms.")} />
                </div>
                <form onSubmit={handleSendMessage} className="relative group">
                  <div className="absolute -inset-0.5 rounded-[24px] bg-white/10 opacity-0 blur transition duration-500 group-focus-within:opacity-100" />
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Sam AI anything..."
                    className="relative h-28 w-full resize-none rounded-[22px] border border-white/10 bg-black/40 p-5 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition-all scrollbar-hide shadow-2xl backdrop-blur-sm"
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  />
                  <button 
                    disabled={!input.trim() || loading}
                    className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black transition-all hover:scale-110 hover:brightness-110 active:scale-90 disabled:opacity-20 disabled:grayscale shadow-lg shadow-white/40"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin text-black" /> : <Send className="h-4 w-4" />}
                  </button>
                </form>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ChatQuickAction({ icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/40 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-95"
    >
      {React.cloneElement(icon, { size: 13, className: "opacity-70 text-white" })}
      {label}
    </button>
  );
}

