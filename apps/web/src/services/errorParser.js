/**
 * 🛰️ SAM Error Analysis Engine
 * Parses raw compiler/runtime output into structured Monaco markers.
 */

const MONACO_SEVERITY = {
  ERROR: 8, // monaco.MarkerSeverity.Error
  WARNING: 4,
  INFO: 2
};

/**
 * Parses stderr into a list of Monaco markers.
 * @param {string} output - Raw stderr or stdout content
 * @param {string} language - Current active language
 * @returns {Array} - List of marker objects
 */
export const parseErrors = (output, language) => {
  if (!output) return [];
  const markers = [];
  const lines = output.split('\n');

  // 🛡️ C/C++ Parser (GCC/Clang)
  // Format: "main.cpp:5:10: error: message"
  if (language === 'cpp' || language === 'c') {
    const regex = /:(\d+):(\d+):\s+(error|warning):\s+(.*)/i;
    lines.forEach(line => {
      const match = line.match(regex);
      if (match) {
        markers.push({
          startLineNumber: parseInt(match[1]),
          startColumn: parseInt(match[2]),
          endLineNumber: parseInt(match[1]),
          endColumn: parseInt(match[2]) + 1,
          message: match[4],
          severity: match[3].toLowerCase() === 'error' ? MONACO_SEVERITY.ERROR : MONACO_SEVERITY.WARNING
        });
      }
    });
  }

  // ☕ Java Parser (javac)
  // Format: "Solution.java:5: error: message"
  else if (language === 'java') {
    const regex = /:(\d+):\s+error:\s+(.*)/i;
    lines.forEach(line => {
      const match = line.match(regex);
      if (match) {
        markers.push({
          startLineNumber: parseInt(match[1]),
          startColumn: 1,
          endLineNumber: parseInt(match[1]),
          endColumn: 100, // Highlight whole line
          message: match[2],
          severity: MONACO_SEVERITY.ERROR
        });
      }
    });
  }

  // 🐍 Python Parser
  // Format: File "solution.py", line 4, in <module>\n SyntaxError: message
  else if (language === 'python') {
    // Look for last traceback line
    const tracebackRegex = /line\s+(\d+)/i;
    const errorMsgRegex = /(\w+Error):\s+(.*)/i;
    
    let lastLineNum = -1;
    lines.forEach(line => {
      const tbMatch = line.match(tracebackRegex);
      if (tbMatch) lastLineNum = parseInt(tbMatch[1]);
      
      const msgMatch = line.match(errorMsgRegex);
      if (msgMatch && lastLineNum !== -1) {
        markers.push({
          startLineNumber: lastLineNum,
          startColumn: 1,
          endLineNumber: lastLineNum,
          endColumn: 100,
          message: `${msgMatch[1]}: ${msgMatch[2]}`,
          severity: MONACO_SEVERITY.ERROR
        });
      }
    });
  }

  // 📜 Node.js / JavaScript
  // Format: solution.js:5\n SyntaxError: message
  else if (language === 'javascript' || language === 'nodejs') {
    const stackRegex = /:(\d+)(?::(\d+))?$/;
    const errorMsgRegex = /(\w+Error):\s+(.*)/i;

    let lastLineNum = -1;
    let lastCol = 1;
    
    lines.forEach(line => {
      const stackMatch = line.match(stackRegex);
      if (stackMatch) {
        lastLineNum = parseInt(stackMatch[1]);
        if (stackMatch[2]) lastCol = parseInt(stackMatch[2]);
      }
      
      const msgMatch = line.match(errorMsgRegex);
      if (msgMatch && lastLineNum !== -1) {
        markers.push({
          startLineNumber: lastLineNum,
          startColumn: lastCol,
          endLineNumber: lastLineNum,
          endColumn: lastCol + 5,
          message: `${msgMatch[1]}: ${msgMatch[2]}`,
          severity: MONACO_SEVERITY.ERROR
        });
      }
    });
  }

  return markers;
};

export default { parseErrors };
