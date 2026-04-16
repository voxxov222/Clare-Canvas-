import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';

export default function ChartNode({ data }: { data: { label: string; initialCode?: string } }) {
  return (
    <motion.div 
      className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 w-64 cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-white font-semibold mb-2">{data.label}</div>
      <div className="h-32 bg-white/5 rounded-xl flex items-center justify-center text-xs text-white/50">
        {data.initialCode ? 'Chart Rendering...' : 'No Data'}
      </div>
      <Handle type="target" position={Position.Left} className="!bg-cyan-500 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-cyan-500 !w-3 !h-3" />
    </motion.div>
  );
}
