import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';

export default function WebNode({ data }: { data: { label: string; url: string } }) {
  return (
    <motion.div 
      className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 w-96 h-80 cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-white font-semibold mb-2 truncate">{data.label}</div>
      <div className="h-64 bg-white/5 rounded-xl overflow-hidden">
        <iframe 
          src={data.url} 
          className="w-full h-full border-none"
          title={data.label}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <Handle type="target" position={Position.Left} className="!bg-cyan-500 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-cyan-500 !w-3 !h-3" />
    </motion.div>
  );
}
