import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { Wifi, Bluetooth, MessageSquare, Bell, Smartphone, Target, Activity, Cpu, Battery, Zap, Globe, Shield, Satellite, Database, Terminal, Radio, Layers, Brain } from 'lucide-react';
import { NodePopupMenu } from './NodePopupMenu';

export const widgetTypes = [
  { name: 'Wi-Fi', icon: Wifi, color: 'text-green-400', animation: 'animate-pulse' },
  { name: 'Bluetooth', icon: Bluetooth, color: 'text-blue-400', animation: 'animate-spin' },
  { name: 'SMS', icon: MessageSquare, color: 'text-purple-400', animation: 'animate-bounce' },
  { name: 'Notifications', icon: Bell, color: 'text-yellow-400', animation: 'animate-ping' },
  { name: 'System Monitor', icon: Target, color: 'text-red-400', animation: 'animate-pulse' },
  { name: 'Messenger', icon: Smartphone, color: 'text-blue-500', animation: 'animate-pulse' },
  { name: 'Activity', icon: Activity, color: 'text-pink-400', animation: 'animate-pulse' },
  { name: 'CPU Load', icon: Cpu, color: 'text-orange-400', animation: 'animate-pulse' },
  { name: 'Battery', icon: Battery, color: 'text-emerald-400', animation: 'animate-pulse' },
  { name: 'Energy', icon: Zap, color: 'text-amber-400', animation: 'animate-pulse' },
  { name: 'Network', icon: Globe, color: 'text-cyan-400', animation: 'animate-pulse' },
  { name: 'Security', icon: Shield, color: 'text-rose-400', animation: 'animate-pulse' },
  { name: 'Satellite', icon: Satellite, color: 'text-sky-400', animation: 'animate-spin' },
  { name: 'Database', icon: Database, color: 'text-indigo-400', animation: 'animate-pulse' },
  { name: 'Terminal', icon: Terminal, color: 'text-gray-400', animation: 'animate-pulse' },
  { name: 'Radio', icon: Radio, color: 'text-teal-400', animation: 'animate-ping' },
  { name: 'Layers', icon: Layers, color: 'text-violet-400', animation: 'animate-pulse' },
  { name: 'AI Core', icon: Brain, color: 'text-fuchsia-400', animation: 'animate-pulse' },
];

export default function WidgetNode({ data, selected }: { data: { label: string; type: string }, selected?: boolean }) {
  const widget = widgetTypes.find(w => w.name === data.type) || widgetTypes[0];
  const [active, setActive] = useState(false);

  return (
    <motion.div 
      className={`bg-black/80 backdrop-blur-3xl border ${selected ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'border-white/10'} rounded-3xl p-4 w-48 cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      onClick={() => setActive(!active)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-full bg-white/10 ${active ? widget.animation : ''}`}>
          <widget.icon className={widget.color} size={24} />
        </div>
        <div className="text-xs text-white/50 font-mono">{active ? 'ON' : 'OFF'}</div>
      </div>
      <div className="text-white font-semibold mb-1">{data.label}</div>
      <div className="text-[10px] text-white/40 mb-3">Status: {active ? 'Operational' : 'Idle'}</div>
      
      {/* High-tech visual indicator */}
      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${active ? 'bg-cyan-500' : 'bg-white/20'}`}
          initial={{ width: '0%' }}
          animate={{ width: active ? '100%' : '20%' }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <Handle type="target" position={Position.Left} className="!bg-cyan-500 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-cyan-500 !w-3 !h-3" />
    </motion.div>
  );
}
