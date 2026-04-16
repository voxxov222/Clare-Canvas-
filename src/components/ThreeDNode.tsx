import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
import { useState } from 'react';
import { Handle, Position, useNodeId, useStore } from '@xyflow/react';
import { motion } from 'motion/react';
import { threeDLibrary } from '../constants/threeDLibrary';

export default function ThreeDNode({ data }: { data: { label: string } }) {
  const [lightIntensity, setLightIntensity] = useState(1);
  const [lightType, setLightType] = useState<'directional' | 'point' | 'spot'>('directional');
  const [roughness, setRoughness] = useState(0.1);
  const [metalness, setMetalness] = useState(0.2);
  const [clearcoat, setClearcoat] = useState(1);
  const [geometry, setGeometry] = useState(threeDLibrary[0].geometry);
  const [enableZoom, setEnableZoom] = useState(true);
  const [enablePan, setEnablePan] = useState(true);
  const [enableRotate, setEnableRotate] = useState(true);
  
  const nodeId = useNodeId();
  const selected = useStore((s) => s.nodes.find((n) => n.id === nodeId)?.selected);

  return (
    <motion.div 
      className={`bg-white/5 backdrop-blur-2xl border ${selected ? 'border-accent shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]'} rounded-2xl p-3 w-72`}
      animate={selected ? { scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.6)" } : { scale: 1, boxShadow: "0 0 15px rgba(6,182,212,0.1)" }}
      transition={{ duration: 0.5, repeat: selected ? Infinity : 0, repeatType: "reverse" }}
    >
      <div className="text-text-primary font-semibold mb-2 flex items-center justify-between">
        {data.label}
      </div>
      <div className="h-48 bg-black/40 rounded-xl overflow-hidden mb-3 border border-white/10 shadow-inner">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <OrbitControls 
            enableZoom={enableZoom} 
            enablePan={enablePan} 
            enableRotate={enableRotate} 
          />
          {lightType === 'directional' && <directionalLight position={[5, 5, 5]} intensity={lightIntensity} castShadow />}
          {lightType === 'point' && <pointLight position={[5, 5, 5]} intensity={lightIntensity} castShadow />}
          {lightType === 'spot' && <spotLight position={[5, 5, 5]} intensity={lightIntensity} castShadow />}
          <Stage environment="city" intensity={0.5}>
            <mesh castShadow receiveShadow>
              {geometry === 'box' && <boxGeometry args={[1, 1, 1]} />}
              {geometry === 'sphere' && <sphereGeometry args={[0.7, 32, 32]} />}
              {geometry === 'torus' && <torusGeometry args={[0.5, 0.2, 16, 100]} />}
              {geometry === 'cone' && <coneGeometry args={[0.5, 1, 32]} />}
              {(geometry === 'chair' || geometry === 'table' || geometry === 'structure') && <boxGeometry args={[0.5, 1, 0.5]} />}
              <meshPhysicalMaterial 
                color="orange" 
                roughness={roughness} 
                metalness={metalness} 
                clearcoat={clearcoat} 
                clearcoatRoughness={0} 
              />
            </mesh>
          </Stage>
        </Canvas>
      </div>
      <div className="flex flex-col gap-2 text-[10px] text-text-secondary">
        <div className="grid grid-cols-3 gap-1">
          <button onClick={() => setEnableRotate(!enableRotate)} className={`p-1 rounded ${enableRotate ? 'bg-accent text-white' : 'bg-bg-dark'}`}>Rotate</button>
          <button onClick={() => setEnableZoom(!enableZoom)} className={`p-1 rounded ${enableZoom ? 'bg-accent text-white' : 'bg-bg-dark'}`}>Zoom</button>
          <button onClick={() => setEnablePan(!enablePan)} className={`p-1 rounded ${enablePan ? 'bg-accent text-white' : 'bg-bg-dark'}`}>Pan</button>
        </div>
        <select 
          className="bg-bg-dark/80 text-text-primary p-1 rounded-lg border border-node-border"
          value={geometry}
          onChange={(e) => setGeometry(e.target.value)}
        >
          {threeDLibrary.map(item => <option key={item.id} value={item.geometry}>{item.name}</option>)}
        </select>
        <select 
          className="bg-bg-dark/80 text-text-primary p-1 rounded-lg border border-node-border"
          value={lightType}
          onChange={(e) => setLightType(e.target.value as any)}
        >
          <option value="directional">Directional Light</option>
          <option value="point">Point Light</option>
          <option value="spot">Spot Light</option>
        </select>
        <label>Intensity: {lightIntensity.toFixed(1)}</label>
        <input type="range" min="0" max="5" step="0.1" value={lightIntensity} onChange={(e) => setLightIntensity(parseFloat(e.target.value))} className="w-full accent-accent" />
        <label>Roughness: {roughness.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={roughness} onChange={(e) => setRoughness(parseFloat(e.target.value))} className="w-full accent-accent" />
        <label>Metalness: {metalness.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={metalness} onChange={(e) => setMetalness(parseFloat(e.target.value))} className="w-full accent-accent" />
        <label>Clearcoat: {clearcoat.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={clearcoat} onChange={(e) => setClearcoat(parseFloat(e.target.value))} className="w-full accent-accent" />
      </div>
      <Handle type="target" position={Position.Left} className="!bg-accent !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-accent !w-3 !h-3" />
    </motion.div>
  );
}
