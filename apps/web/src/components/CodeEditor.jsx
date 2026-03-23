import React, { useCallback, useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";

const LANGUAGE_TO_MONACO = {
  nodejs: "javascript",
  python: "python",
  cpp: "cpp",
  c: "cpp",
  java: "java"
};

export default function CodeEditor({ language, value, onChange, onCursorChange, theme = "vs-dark", options = {} }) {
  const editorRef = useRef(null);

  const monacoLanguage = useMemo(() => LANGUAGE_TO_MONACO[language] ?? "javascript", [language]);

  const handleMount = useCallback((editor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition(() => {
      const pos = editor.getPosition();
      if (!pos) return;
      onCursorChange?.({ lineNumber: pos.lineNumber, column: pos.column });
    });
  }, [onCursorChange]);

  const handleChange = useCallback(
    (v) => {
      onChange?.(v ?? "");
    },
    [onChange]
  );

  return (
    <div className="h-full w-full bg-transparent">
      <Editor
        theme={theme}
        language={monacoLanguage}
        value={value}
        onMount={handleMount}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          fontSize: options.fontSize || 12, // Smaller default for mobile
          tabSize: options.tabSize || 2,
          lineNumbers: "on",
          lineNumbersMinChars: 2, // Save space
          folding: false, // Save space
          glyphMargin: false, // Save space
          wordWrap: "on", // CRITICAL for mobile
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
          backgroundColor: "#00000000" // Transparent
        }}
        loading={<div className="flex h-full items-center justify-center text-blue-500/20 font-black uppercase tracking-widest animate-pulse">Initializing LiquidIDE</div>}
      />
    </div>
  );
}

