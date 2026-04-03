import React, { useCallback, useMemo, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
import ENDPOINTS from "../services/endpoints";

const LANGUAGE_TO_MONACO = {
  nodejs: "javascript",
  python: "python",
  cpp: "cpp",
  c: "cpp",
  java: "java"
};

const RANDOM_NAMES = [
  "Anonymous Panda", "Anonymous Google SE", "Anonymous Byte", "Anonymous SRE", 
  "Anonymous Kernel", "Anonymous Stack", "Anonymous Pointer", "Anonymous Docker"
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function CodeEditor({ 
  language, 
  value, 
  onChange, 
  onCursorChange, 
  sessionId = "default",
  userName = null,
  theme = "vs-dark", 
  options = {} 
}) {
  const editorRef = useRef(null);
  const bindingRef = useRef(null);
  const providerRef = useRef(null);
  const hasInitializedRef = useRef(false);

  const monacoLanguage = useMemo(() => LANGUAGE_TO_MONACO[language] ?? "javascript", [language]);

  const localName = useMemo(() => userName || RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)], [userName]);
  const localColor = useMemo(() => COLORS[Math.floor(Math.random() * COLORS.length)], []);

  const handleMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Define Monolith Dark Theme
    monaco.editor.defineTheme('monolith-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'FFFFFF', background: '000000' },
        { token: 'comment', foreground: '555555', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'FFFFFF', fontStyle: 'bold' },
        { token: 'string', foreground: 'AAAAAA' },
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#FFFFFF',
        'editorLineNumber.foreground': '#333333',
        'editorLineNumber.activeForeground': '#FFFFFF',
        'editorIndentGuide.background': '#111111',
        'editor.selectionBackground': '#222222',
        'editorCursor.foreground': '#FFFFFF',
      }
    });

    // Define Monolith Light Theme
    monaco.editor.defineTheme('monolith-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: '', foreground: '000000', background: 'FAF9F6' },
        { token: 'comment', foreground: '999999', fontStyle: 'italic' },
        { token: 'keyword', foreground: '000000', fontStyle: 'bold' },
      ],
      colors: {
        'editor.background': '#FAF9F6',
        'editor.foreground': '#000000',
        'editorLineNumber.foreground': '#CCCCCC',
        'editorLineNumber.activeForeground': '#000000',
        'editorIndentGuide.background': '#EEEEEE',
        'editor.selectionBackground': '#E0E0E0',
        'editorCursor.foreground': '#000000',
      }
    });

    if (providerRef.current) return;

    // Initialize Yjs
    const ydoc = new Y.Doc();
    const endpoint = ENDPOINTS.WS_ENDPOINT;

    const provider = new SocketIOProvider(endpoint, sessionId, ydoc, {
      ...ENDPOINTS.SOCKET_OPTIONS,
      autoConnect: true
    });

    const ytext = ydoc.getText("monaco");

    // Bind Monaco to Yjs
    const binding = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    // Set local awareness (Cursors/Presence)
    provider.awareness.setLocalStateField("user", {
      name: localName,
      color: localColor
    });

    bindingRef.current = binding;
    providerRef.current = provider;

    editor.onDidChangeCursorPosition(() => {
      const pos = editor.getPosition();
      if (!pos) return;
      onCursorChange?.({ lineNumber: pos.lineNumber, column: pos.column });
    });

    // ULTIMATE FIX: Only insert initial value if THIS browser tab hasn't already joined this room.
    // This prevents duplication when switching languages (remounting) in the same session.
    const roomKey = `sam_synced_${sessionId}`;
    
    provider.on('sync', (isSynced) => {
      if (isSynced !== false && !hasInitializedRef.current && value) {
        hasInitializedRef.current = true;
        
        // Wait a bit for server state to land
        setTimeout(() => {
          const currentText = ytext.toString().trim();
          const alreadySynced = window[roomKey];

          if (currentText === "" && !alreadySynced) {
            ytext.insert(0, value);
            window[roomKey] = true;
          } else {
            window[roomKey] = true; // Mark as handled
          }
        }, 120);
      }
    });

  }, [sessionId, localName, localColor, onCursorChange, value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
      if (providerRef.current) {
        providerRef.current.destroy();
        providerRef.current = null;
      }
    };
  }, []);

  const handleChange = useCallback((v) => {
    onChange?.(v ?? "");
  }, [onChange]);

  return (
    <div className="h-full w-full bg-transparent">
      <Editor
        theme={theme}
        language={monacoLanguage}
        onMount={handleMount}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          fontSize: options.fontSize || 12,
          tabSize: options.tabSize || 2,
          lineNumbers: "on",
          lineNumbersMinChars: 2,
          folding: false,
          glyphMargin: false,
          wordWrap: "on",
          wrappingStrategy: "advanced",
          automaticLayout: true,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          padding: { top: 12, bottom: 12 },
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
          readOnly: false,
          renderLineHighlight: "none",
          renderIndentGuides: true,
          guides: { indentation: true },
          backgroundColor: "#00000000"
        }}
        loading={<div className="flex h-full items-center justify-center text-blue-500/20 font-black uppercase tracking-widest animate-pulse">Initializing Collaborative Layer</div>}
      />
    </div>
  );
}
