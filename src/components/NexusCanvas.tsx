import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';
import ThreeDNode from './ThreeDNode';
import CodeNode from './CodeNode';
import AssetNode from './AssetNode';
import WidgetNode from './WidgetNode';
import ChartNode from './ChartNode';
import WebNode from './WebNode';
import FloatingMenu from './FloatingMenu';
import FloatingAgentOrb from './FloatingAgentOrb';
import CustomEdge from './CustomEdge';

const nodeTypes = {
  threeD: ThreeDNode,
  code: CodeNode,
  asset: AssetNode,
  widget: WidgetNode,
  chart: ChartNode,
  web: WebNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const initialNodes: Node[] = [
  { id: '1', type: 'default', position: { x: 50, y: 50 }, data: { label: 'Visual Asset' } },
  { id: '2', type: 'default', position: { x: 250, y: 50 }, data: { label: 'Video Stream' } },
  { id: '3', type: 'threeD', position: { x: 450, y: 50 }, data: { label: '3D Model' } },
  { id: '4', type: 'code', position: { x: 650, y: 50 }, data: { label: 'Code Editor' } },
  { id: 'w1', type: 'widget', position: { x: 50, y: 250 }, data: { label: 'Wi-Fi', type: 'Wi-Fi' } },
  { id: 'w2', type: 'widget', position: { x: 250, y: 250 }, data: { label: 'Bluetooth', type: 'Bluetooth' } },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', type: 'custom', animated: true }];

export default function NexusCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'custom', animated: true }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!reactFlowInstance || !reactFlowWrapper.current) return;

    const data = event.dataTransfer.getData('application/json');
    if (data) {
      const { name, type } = JSON.parse(data);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: Node = {
        id: `node_${Date.now()}`,
        position,
        data: { label: name, type: type === 'widget' ? name : undefined },
        type: type === 'widget' ? 'widget' : 'default',
      };
      setNodes((nds) => [...nds, newNode]);
    }
  }, [nodes, setNodes, reactFlowInstance]);

  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    setEdges((eds) => {
      const deletedNodeIds = deletedNodes.map((n) => n.id);
      return eds.filter((edge) => !deletedNodeIds.includes(edge.source) && !deletedNodeIds.includes(edge.target));
    });
  }, [setEdges]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newNode: Node = {
          id: `${nodes.length + 1}`,
          position: { x: Math.random() * 400, y: Math.random() * 400 },
          data: { label: file.name, src: e.target?.result as string, type: file.type },
          type: 'asset',
        };
        setNodes((nds) => [...nds, newNode]);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  const addNode = (nodeData: { name: string; type?: string; initialCode?: string }) => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        label: nodeData.name, 
        type: nodeData.type === 'widget' ? nodeData.name : undefined,
        initialCode: nodeData.initialCode,
        onAddNode: addNode, // Pass callback to nodes
        onDeleteNode: deleteNode // Pass callback to nodes
      },
      type: nodeData.type === 'widget' ? 'widget' : 
            nodeData.name.includes('3D') ? 'threeD' : 
            nodeData.name.includes('Code') ? 'code' : 
            nodeData.name.includes('Asset') ? 'asset' : 
            nodeData.name.includes('Chart') ? 'chart' : 
            nodeData.type === 'web' ? 'web' : 'default',
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="flex h-screen w-screen bg-bg-dark text-text-primary">
      <Sidebar onAddNode={addNode} />
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <FloatingAgentOrb />
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload} 
          accept="image/*,video/*,.gif"
        />
        <button 
          className="absolute top-4 right-4 z-10 bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Asset
        </button>
        <FloatingMenu onAddNode={addNode} />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          colorMode="dark"
          style={{
            backgroundImage: 'radial-gradient(#2a2d35 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#2a2d35" />
        </ReactFlow>
      </div>
    </div>
  );
}
