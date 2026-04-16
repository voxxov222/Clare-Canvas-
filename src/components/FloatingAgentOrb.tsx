import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pin, Move, Zap, Settings, Code, Terminal, Database, Globe, Cpu, Shield, Camera, Mic, Wifi, Bluetooth, Mail, Music, Video, Cloud, GitBranch, Search, Layers, RefreshCw, Trash2 } from 'lucide-react';
import { aiService } from '../services/aiService';

const agentOptions = [
  { name: 'Chat with AI', icon: Zap, action: () => console.log('Chat') },
  { name: 'Think (High)', icon: Cpu, action: () => aiService.think('Analyze this complex problem...') },
  { name: 'Generate Image', icon: Camera, action: () => aiService.generateImage('A futuristic city', '1K', '16:9') },
  { name: 'Generate Video', icon: Video, action: () => aiService.generateVideo('A futuristic city', '16:9') },
  { name: 'Search Grounding', icon: Search, action: () => aiService.search('Latest AI news') },
  { name: 'Maps Grounding', icon: Globe, action: () => aiService.mapSearch('Coffee shops near me') },
  { name: 'System Monitor', icon: Cpu, action: () => console.log('Monitoring...') },
  { name: 'Database Sync', icon: Database, action: () => console.log('Syncing...') },
  { name: 'Network Scan', icon: Wifi, action: () => console.log('Scanning...') },
  { name: 'Bluetooth Pair', icon: Bluetooth, action: () => console.log('Pairing...') },
  { name: 'SMS Gateway', icon: Mail, action: () => console.log('Sending...') },
  { name: 'Cloud Deploy', icon: Cloud, action: () => console.log('Deploying...') },
  { name: 'GitHub Sync', icon: GitBranch, action: () => console.log('Syncing...') },
  { name: 'Security Audit', icon: Shield, action: () => console.log('Auditing...') },
  { name: 'Music Gen', icon: Music, action: () => console.log('Generating...') },
  { name: 'Code Refactor', icon: Code, action: () => console.log('Refactoring...') },
  { name: 'Data Visualizer', icon: Layers, action: () => console.log('Visualizing...') },
  { name: 'System Refresh', icon: RefreshCw, action: () => console.log('Refreshing...') },
  { name: 'Clear Cache', icon: Trash2, action: () => console.log('Clearing...') },
  { name: 'Advanced Settings', icon: Settings, action: () => console.log('Settings...') },
];

export default function FloatingAgentOrb() {
  const [isPinned, setIsPinned] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-[100] cursor-pointer"
      animate={{ rotate: showOptions ? 360 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative group">
        {/* Avatar-Centric Orb */}
        <motion.div 
          className="w-40 h-40 rounded-full relative flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowOptions(!showOptions)}
        >
          {/* Main Energy Field (The Orb) */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Avatar Silhouette */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-blue-900/50 border border-blue-400/30 flex items-center justify-center overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-blue-400/20 border-2 border-blue-300 animate-pulse" />
          </div>

          {/* Rotating Peripheral Data Nodes */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 rounded-full bg-blue-600/60 border border-blue-300 flex items-center justify-center shadow-lg"
              animate={{ 
                rotate: 360,
              }}
              style={{
                originX: "50%",
                originY: "50%",
                top: "-10px",
                left: "56px",
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: i * 2 }}
            >
              <Zap size={12} className="text-white" />
            </motion.div>
          ))}
        </motion.div>
        
        <AnimatePresence>
          {showOptions && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, originX: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-40 left-0 w-80 bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(59,130,246,0.3)] grid grid-cols-2 gap-4"
            >
              {agentOptions.map((opt) => (
                <motion.button 
                  key={opt.name}
                  draggable
                  onDragStart={(e) => {
                    (e as any).dataTransfer.setData('application/json', JSON.stringify({ type: 'agent-option', name: opt.name }));
                    setShowOptions(false);
                  }}
                  onClick={() => { opt.action(); setShowOptions(false); }}
                  className="flex items-center gap-3 p-3 hover:bg-blue-900/40 rounded-xl text-xs text-blue-100 transition-all border border-transparent hover:border-blue-500/50 cursor-grab"
                >
                  <opt.icon size={18} className="text-blue-400" />
                  {opt.name}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
