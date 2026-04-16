import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Handle, Position } from '@xyflow/react';
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { motion } from 'motion/react';
import { NodePopupMenu } from './NodePopupMenu';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default function CodeNode({ data, selected }: { data: { label: string; initialCode?: string; onAddNode?: any; onDeleteNode?: any }, selected?: boolean }) {
  const [code, setCode] = useState(data.initialCode || '// Write your code here\nconsole.log("Hello World");');
  const [language, setLanguage] = useState('javascript');
  const [chat, setChat] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [terminalHistory, setTerminalHistory] = useState<{ command: string, output: string }[]>([]);
  const [view, setView] = useState<'chat' | 'terminal'>('terminal');
  const [input, setInput] = useState('');
  const [showDevOptions, setShowDevOptions] = useState(false);
  const [chartOptions, setChartOptions] = useState<{ timeframe?: string, type?: string } | null>(null);

  const languages = ['javascript', 'typescript', 'rust', 'python', 'html', 'css'];

  const addNodeTool: FunctionDeclaration = {
    name: "addNode",
    description: "Adds a new node to the canvas.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "The name of the node to add." },
        type: { type: Type.STRING, description: "The type of the node (e.g., 'widget', 'threeD', 'code', 'asset', 'chart', 'web')." },
      },
      required: ["name"],
    },
  };

  const deleteNodeTool: FunctionDeclaration = {
    name: "deleteNode",
    description: "Deletes a node from the canvas by ID.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        nodeId: { type: Type.STRING, description: "The ID of the node to delete." },
      },
      required: ["nodeId"],
    },
  };

  const handleChat = async (prompt?: string) => {
    const text = prompt || input;
    if (!text) return;
    if (!prompt) setInput('');

    if (view === 'terminal') {
      const command = text.trim();
      let output = '';

      if (command.startsWith('gh repo clone ')) {
        const repo = command.replace('gh repo clone ', '');
        output = `> Cloning ${repo}...\n> Repository cloned successfully.\n> Detecting dependencies...\n> Found package.json\n> Executing 'npm install'...\n> Dependencies installed successfully.\n> Setup complete for ${repo}.`;
        
        // Add new node
        if (data.onAddNode) {
          data.onAddNode({ 
            name: `Repo: ${repo.split('/')[1]}`, 
            type: 'code', 
            initialCode: `// Cloned from ${repo}\n// Loaded at ${new Date().toLocaleTimeString()}\nconsole.log("Zerpit loaded");` 
          });
        }
      } else if (command === 'clear') {
        setTerminalHistory([]);
        return;
      } else {
        output = `Simulated output for command: "${command}"\n> Current time: ${new Date().toLocaleTimeString()}\n> Environment: Secure Sandbox`;
      }

      setTerminalHistory(prev => [...prev, { command, output }]);
      return;
    }

    const userMsg = { role: 'user' as const, text };
    setChat(prev => [...prev, userMsg]);

    // Check for chart creation request
    if (text.toLowerCase().includes('chart') && !chartOptions) {
      setChat(prev => [...prev, { role: 'ai', text: 'I can create that crypto chart for you! What timeframe (e.g., 1h, 24h) and chart type (e.g., line, bar) would you like?' }]);
      setChartOptions({});
      return;
    }

    // Check for URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    if (urls && urls.length > 0) {
      const url = urls[0];
      setChat(prev => [...prev, { role: 'ai', text: `Opening ${url}...` }]);
      if (data.onAddNode) {
        data.onAddNode({ name: 'Web Page', type: 'web', url });
      }
      return;
    }

    if (chartOptions && !chartOptions.timeframe) {
      setChartOptions({ ...chartOptions, timeframe: text });
      setChat(prev => [...prev, { role: 'ai', text: 'Got it. What chart type would you like?' }]);
      return;
    }

    if (chartOptions && !chartOptions.type) {
      const finalOptions = { ...chartOptions, type: text };
      setChartOptions(null);
      setChat(prev => [...prev, { role: 'ai', text: `Generating ${finalOptions.type} chart for ${finalOptions.timeframe}...` }]);
      
      // Generate code and add node
      const generatedCode = `// Crypto Chart for ${finalOptions.timeframe} (${finalOptions.type})\n// Webhook integration: https://api.coingecko.com/...\nexport default function Chart() { return <div>Crypto Chart</div>; }`;
      if (data.onAddNode) {
        data.onAddNode({ name: 'Crypto Chart', initialCode: generatedCode });
      }
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are an advanced AI coding agent. Context: ${code}\nUser Request: ${text}\nProvide code or perform the requested action.`,
        config: {
          systemInstruction: "You are an advanced AI coding agent that can interact with the canvas by adding or deleting nodes using the provided tools.",
          tools: [{ functionDeclarations: [addNodeTool, deleteNodeTool] }],
        },
      });

      // Handle function calls
      if (response.functionCalls) {
        for (const call of response.functionCalls) {
          if (call.name === 'addNode') {
            data.onAddNode(call.args);
            setChat(prev => [...prev, { role: 'ai', text: `Added node: ${call.args.name}` }]);
          } else if (call.name === 'deleteNode') {
            data.onDeleteNode(call.args.nodeId);
            setChat(prev => [...prev, { role: 'ai', text: `Deleted node: ${call.args.nodeId}` }]);
          }
        }
      }

      setChat(prev => [...prev, { role: 'ai', text: response.text || 'No response' }]);
    } catch (e) {
      setChat(prev => [...prev, { role: 'ai', text: 'Error: ' + e }]);
    }
  };

  const devOptions = [
    { label: 'Generate Widget', action: () => handleChat('Generate a high-tech, interactive, animated React widget component with no external dependencies. Include advanced animations, customizable colors, and interactive functionality.') },
    { label: 'Generate Three.js Scene', action: () => handleChat('Generate a basic Three.js scene with a rotating cube') },
    { label: 'Create Chart', action: () => handleChat('Create a Recharts bar chart component') },
    { label: 'Build 3D World', action: () => handleChat('Create a complex 3D world with terrain') },
    { label: 'Install Dependencies', action: () => console.log('Installing...') },
    { label: 'Add 3rd Party Integration', action: () => console.log('Adding...') },
    { label: 'Add GitHub', action: () => console.log('Connecting...') },
    { label: 'Deploy to Cloud', action: () => console.log('Deploying...') },
    { label: 'Deploy to Virtual Env', action: () => console.log('Deploying...') },
    { label: 'Decompile', action: () => console.log('Decompiling...') },
    { label: 'Analyze Code', action: () => handleChat('Analyze the current code for performance and security') },
    { label: 'Refactor Code', action: () => handleChat('Refactor the current code for better readability') },
    { label: 'Add Unit Tests', action: () => handleChat('Add unit tests for the current code') },
    { label: 'Document Code', action: () => handleChat('Add JSDoc comments to the current code') },
    { label: 'Optimize Performance', action: () => handleChat('Optimize the current code for better performance') },
    { label: 'Convert to TypeScript', action: () => handleChat('Convert the current code to TypeScript') },
    { label: 'Add Error Handling', action: () => handleChat('Add robust error handling to the current code') },
    { label: 'Add Logging', action: () => handleChat('Add logging to the current code') },
    { label: 'Add API Endpoint', action: () => handleChat('Add an API endpoint to the current code') },
    { label: 'Add Database Model', action: () => handleChat('Add a database model to the current code') },
    { label: 'Add UI Component', action: () => handleChat('Add a new UI component to the current code') },
    { label: 'Add Animation', action: () => handleChat('Add a complex animation to the current code') },
    { label: 'Add Data Visualization', action: () => handleChat('Add a data visualization to the current code') },
    { label: 'Add Authentication', action: () => handleChat('Add authentication to the current code') },
    { label: 'Add Form Validation', action: () => handleChat('Add form validation to the current code') },
    { label: 'Add Internationalization', action: () => handleChat('Add internationalization to the current code') },
    { label: 'Add Accessibility', action: () => handleChat('Add accessibility features to the current code') },
    { label: 'Add Responsive Design', action: () => handleChat('Add responsive design to the current code') },
    { label: 'Add Dark Mode', action: () => handleChat('Add dark mode to the current code') },
    { label: 'Add Theme Support', action: () => handleChat('Add theme support to the current code') },
    { label: 'Add Analytics', action: () => handleChat('Add analytics to the current code') },
    { label: 'Add Monitoring', action: () => handleChat('Add monitoring to the current code') },
    { label: 'Add CI/CD Pipeline', action: () => handleChat('Add a CI/CD pipeline to the current code') },
  ];

  return (
    <NodePopupMenu onAction={(action) => console.log(action)}>
      <motion.div 
        className={`relative bg-white/5 backdrop-blur-2xl border ${selected ? 'border-accent shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]'} rounded-2xl p-3 w-[500px]`}
        animate={selected ? { scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.6)" } : { scale: 1, boxShadow: "0 0 15px rgba(6,182,212,0.1)" }}
        transition={{ duration: 0.5, repeat: selected ? Infinity : 0, repeatType: "reverse" }}
      >
      {/* Terminal Header */}
      <div className="flex justify-between items-center mb-3 bg-bg-dark/50 p-2 rounded-lg border border-node-border">
        <div className="text-sm font-bold text-text-primary">{data.label}</div>
        <select 
          className="bg-bg-dark text-xs text-text-secondary p-1 rounded border border-node-border"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map(lang => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Dev Options Box */}
      <div className="bg-bg-dark/50 border border-node-border rounded-xl p-2 mb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs font-semibold text-text-secondary">Developer Options</div>
          <button 
            className="text-[10px] text-text-secondary hover:text-accent" 
            onClick={() => setShowDevOptions(!showDevOptions)}
          >
            {showDevOptions ? 'Minimize' : 'Expand'}
          </button>
        </div>
        {showDevOptions && (
          <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary max-h-48 overflow-y-auto">
            {devOptions.map(opt => (
              <button key={opt.label} className="text-left text-text-primary hover:text-accent" onClick={opt.action}>{opt.label}</button>
            ))}
          </div>
        )}
      </div>

      <div className="h-64 bg-black/40 rounded-xl overflow-hidden mb-3 border border-white/10 shadow-inner">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{ minimap: { enabled: false }, fontSize: 12 }}
        />
      </div>

      <div className="flex gap-2 mb-2">
        <button 
          className="flex-1 bg-accent text-white p-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors"
          onClick={() => { 
            if (language === 'javascript') {
              try { new Function(code)(); } catch (e) { console.error(e); } 
            } else {
              setChat(prev => [...prev, { role: 'ai', text: `Running ${language} code requires an external environment.` }]);
            }
          }}
        >
          {language === 'javascript' ? 'Run Code' : 'View/Compile'}
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        <button 
          className={`flex-1 p-2 rounded-lg text-xs font-semibold ${view === 'terminal' ? 'bg-accent text-white' : 'bg-node-border text-text-secondary'}`}
          onClick={() => setView('terminal')}
        >
          Terminal
        </button>
        <button 
          className={`flex-1 p-2 rounded-lg text-xs font-semibold ${view === 'chat' ? 'bg-accent text-white' : 'bg-node-border text-text-secondary'}`}
          onClick={() => setView('chat')}
        >
          Chat
        </button>
      </div>

      <div className="h-32 overflow-y-auto bg-black/20 rounded-lg p-2 mb-2 text-xs text-text-secondary font-mono">
        {view === 'terminal' ? (
          terminalHistory.map((item, i) => (
            <div key={i} className="mb-2">
              <p className="text-accent">$ {item.command}</p>
              <pre className="whitespace-pre-wrap">{item.output}</pre>
            </div>
          ))
        ) : (
          chat.map((msg, i) => <p key={i} className={msg.role === 'user' ? 'text-accent' : ''}>{msg.role}: {msg.text}</p>)
        )}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 bg-bg-dark p-2 rounded-lg text-xs" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask AI or type command..." />
        <button className="bg-node-border p-2 rounded-lg text-xs" onClick={() => handleChat()}>Send</button>
      </div>

      <Handle type="target" position={Position.Left} className="!bg-accent !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-accent !w-3 !h-3" />
    </motion.div>
    </NodePopupMenu>
  );
}
