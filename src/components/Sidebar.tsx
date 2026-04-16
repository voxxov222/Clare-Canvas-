import { Image, Video, Box, BarChart3, AppWindow, Code } from 'lucide-react';
import { widgetTypes } from './WidgetNode';

const nodeTypes = [
  { name: 'Image', icon: Image },
  { name: 'Video', icon: Video },
  { name: '3D Model', icon: Box },
  { name: 'Data Flow', icon: BarChart3 },
  { name: 'Code', icon: Code },
];

export default function Sidebar({ onAddNode }: { onAddNode: (nodeData: any) => void }) {
  const onDragStart = (event: React.DragEvent, nodeData: any) => {
    event.dataTransfer.setData('application/json', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-[220px] bg-sidebar-bg text-text-primary p-4 h-full flex flex-col border-r border-node-border overflow-y-auto">
      <h2 className="text-[11px] uppercase font-semibold text-text-secondary mb-3 tracking-wider">Node Library</h2>
      {nodeTypes.map((node) => (
        <div
          key={node.name}
          draggable
          onDragStart={(e) => onDragStart(e, { name: node.name })}
          onClick={() => onAddNode({ name: node.name })}
          className="flex items-center gap-3 p-2 bg-node-bg border border-node-border rounded hover:border-accent cursor-pointer text-[12px] mb-2 transition-colors"
        >
          <node.icon size={16} className="text-text-secondary" />
          <span>{node.name}</span>
        </div>
      ))}
      
      <h2 className="text-[11px] uppercase font-semibold text-text-secondary mt-6 mb-3 tracking-wider">Widgets</h2>
      {widgetTypes.map((widget) => (
        <div
          key={widget.name}
          draggable
          onDragStart={(e) => onDragStart(e, { name: widget.name, type: 'widget' })}
          onClick={() => onAddNode({ name: widget.name, type: 'widget' })}
          className="flex items-center gap-3 p-2 bg-node-bg border border-node-border rounded hover:border-accent cursor-pointer text-[12px] mb-2 transition-colors"
        >
          <widget.icon size={16} className={widget.color} />
          <span>{widget.name}</span>
        </div>
      ))}
    </div>
  );
}
