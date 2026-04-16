import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Square, Box, Code, Image, LayoutGrid } from 'lucide-react';

const nodeTypes = [
  { name: 'Default', icon: Square },
  { name: '3D Node', icon: Box },
  { name: 'Code Node', icon: Code },
  { name: 'Asset Node', icon: Image },
  { name: 'Widget Node', icon: LayoutGrid },
];

export default function FloatingMenu({ onAddNode }: { onAddNode: (nodeData: { name: string }) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 bg-sidebar-bg/90 backdrop-blur-md border border-node-border rounded-xl p-2 flex flex-col gap-2 shadow-2xl"
          >
            {nodeTypes.map((type) => (
              <button 
                key={type.name}
                onClick={() => onAddNode({ name: type.name })}
                className="flex items-center gap-2 p-2 hover:bg-node-bg rounded-lg text-sm text-text-primary"
              >
                <type.icon size={16} />
                {type.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-accent text-white p-4 rounded-full shadow-2xl hover:bg-blue-600 transition-colors"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
