import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: selected ? '#06b6d4' : '#3b82f6',
        strokeWidth: selected ? 4 : 2,
        filter: selected ? 'drop-shadow(0 0 5px rgba(6,182,212,0.8))' : 'none',
      }}
    />
  );
}
