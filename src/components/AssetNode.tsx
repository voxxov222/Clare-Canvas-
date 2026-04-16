import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';

export default function AssetNode({ data, selected }: { data: { label: string; src: string; type: string }, selected?: boolean }) {
  const isVideo = data.type.startsWith('video/');

  return (
    <motion.div 
      className={`bg-white/5 backdrop-blur-2xl border ${selected ? 'border-accent shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]'} rounded-2xl p-3 w-48`}
      animate={selected ? { scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.6)" } : { scale: 1, boxShadow: "0 0 15px rgba(6,182,212,0.1)" }}
      transition={{ duration: 0.5, repeat: selected ? Infinity : 0, repeatType: "reverse" }}
    >
      <div className="text-text-primary font-semibold mb-2 truncate">{data.label}</div>
      <div className="h-32 bg-black/40 rounded-xl overflow-hidden mb-2 border border-white/10 flex items-center justify-center">
        {isVideo ? (
          <video src={data.src} className="max-h-full max-w-full" controls />
        ) : (
          <img src={data.src} alt={data.label} className="max-h-full max-w-full object-contain" />
        )}
      </div>
      <Handle type="target" position={Position.Left} className="!bg-accent !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-accent !w-3 !h-3" />
    </motion.div>
  );
}
