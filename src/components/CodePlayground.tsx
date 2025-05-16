import React, { useState, useEffect, useRef } from 'react';
import { Play, RefreshCw, Copy, Check, X, Download } from 'lucide-react';
import { T, Var } from "gt-react";


interface CodePlaygroundProps {
  onClose?: () => void;
}

const SAMPLE_CODE = `// Welcome to the Code Playground!
// Write some JavaScript code and click Run to execute it.

function greet(name) {
  return \`Hello, \${name}!\`;
}

// The last expression will be displayed as the result
greet('World');
`;

const CodePlayground: React.FC<CodePlaygroundProps> = ({ onClose }) => {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
    }
  }, [code]);

  // Execute code
  const runCode = () => {
    try {
      setError(null);

      // Create a safe execution environment
      const executeCode = new Function(`
        try {
          // Capture console.log output
          const logs = [];
          const originalConsoleLog = console.log;
          console.log = (...args) => {
            logs.push(args.map(arg =>
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
            originalConsoleLog(...args);
          };

          // Execute the code
          const result = eval(\`${code.replace(/`/g, '\\`')}\`);

          // Restore console.log
          console.log = originalConsoleLog;

          // Return both logs and result
          return {
            logs,
            result: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)
          };
        } catch (error) {
          return { error: error.message };
        }
      `);

      const { logs = [], result, error: execError } = executeCode() || {};

      if (execError) {
        setError(execError);
        setOutput('');
      } else {
        const outputText = [
        ...(logs.length > 0 ? logs.map((log: string) => `// Console output:\n${log}`) : []),
        result !== 'undefined' ? `// Result:\n${result}` : ''].
        filter(Boolean).join('\n\n');

        setOutput(outputText || '// No output');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setOutput('');
    }
  };

  // Reset code to sample
  const resetCode = () => {
    if (confirm('Reset code to default example?')) {
      setCode(SAMPLE_CODE);
      setOutput('');
      setError(null);
    }
  };

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Save code as file
  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playground-code.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => prev === 'dark' ? 'light' : 'dark');
  };

  return (<T id="components.codeplayground.2">
    <div
      className={`w-full h-full flex flex-col ${
      theme === 'dark' ?
      'bg-[#1e1e1e] text-white/90' :
      'bg-[#f5f5f5] text-[#333]'} ${
      isFullscreen ? 'fixed inset-0 z-50' : ''}`}>

      {/* Header */}
      <div className={`flex items-center justify-between p-3 border-b ${
      theme === 'dark' ? 'border-[#333]' : 'border-[#ddd]'}`
      }>
        <div className="flex items-center gap-2">
          <span className="font-medium">Code Playground</span>
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-md text-xs ${
            theme === 'dark' ?
            'bg-[#333] hover:bg-[#444]' :
            'bg-[#eee] hover:bg-[#ddd]'}`
            }>

            <Var>{theme === 'dark' ? <T id="components.codeplayground.0">{'Light Mode'}</T> : <T id="components.codeplayground.1">{'Dark Mode'}</T>}</Var>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={runCode}
            className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-1"
            title="Run Code (Ctrl+Enter)">

            <Play size={16} />
            <span className="text-sm">Run</span>
          </button>

          <button
            onClick={resetCode}
            className={`p-1.5 rounded-md ${
            theme === 'dark' ?
            'hover:bg-[#333]' :
            'hover:bg-[#eee]'}`
            }
            title="Reset Code">

            <RefreshCw size={16} />
          </button>

          <button
            onClick={copyCode}
            className={`p-1.5 rounded-md ${
            theme === 'dark' ?
            'hover:bg-[#333]' :
            'hover:bg-[#eee]'}`
            }
            title="Copy Code">

            <Var>{isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}</Var>
          </button>

          <button
            onClick={saveCode}
            className={`p-1.5 rounded-md ${
            theme === 'dark' ?
            'hover:bg-[#333]' :
            'hover:bg-[#eee]'}`
            }
            title="Save Code">

            <Download size={16} />
          </button>

          <Var>{onClose && (
            <button
              onClick={onClose}
              className={`p-1.5 rounded-md ${
              theme === 'dark' ?
              'hover:bg-[#333]' :
              'hover:bg-[#eee]'}`
              }
              title="Close">

              <X size={16} />
            </button>
            )}</Var>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Code editor */}
        <div className="flex-1 overflow-auto p-2">
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`w-full h-full min-h-[200px] p-3 font-mono text-sm resize-none outline-none ${
            theme === 'dark' ?
            'bg-[#1e1e1e] text-white/90' :
            'bg-[#f5f5f5] text-[#333]'}`
            }
            spellCheck="false"
            onKeyDown={(e) => {
              // Run code on Ctrl+Enter
              if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                runCode();
              }

              // Handle tab key
              if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;

                // Insert 2 spaces
                setCode(
                  code.substring(0, start) + '  ' + code.substring(end)
                );

                // Move cursor position
                setTimeout(() => {
                  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                }, 0);
              }
            }} />

        </div>

        {/* Output panel */}
        <div className={`w-full md:w-1/2 border-t md:border-t-0 md:border-l overflow-auto ${
        theme === 'dark' ? 'border-[#333]' : 'border-[#ddd]'}`
        }>
          <div className={`p-2 text-xs font-medium ${
          theme === 'dark' ? 'bg-[#252525]' : 'bg-[#eaeaea]'}`
          }>
            Output
          </div>

          <Var>{error ? (
            <div className="p-3 font-mono text-sm text-red-400 whitespace-pre-wrap">
              {`// Error:\n${error}`}
            </div>
            ) : (
            <div className={`p-3 font-mono text-sm whitespace-pre-wrap ${
            theme === 'dark' ? 'text-green-400' : 'text-green-700'}`
            }>
              {output}
            </div>
            )}</Var>
        </div>
      </div>
    </div></T>
  );
};

export default CodePlayground;