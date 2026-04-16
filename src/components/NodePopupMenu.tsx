import React, { useState } from 'react';

interface NodePopupMenuProps {
  children: React.ReactNode;
  onAction: (action: string) => void;
}

export const NodePopupMenu = ({ children, onAction }: NodePopupMenuProps) => {
  const [showPopup, setShowPopup] = useState<{ x: number, y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const timer = setTimeout(() => {
      setShowPopup({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }, 500); 
    const clearTimer = () => clearTimeout(timer);
    e.currentTarget.addEventListener('touchend', clearTimer, { once: true });
    e.currentTarget.addEventListener('touchmove', clearTimer, { once: true });
  };

  return (
    <div className="relative" onTouchStart={handleTouchStart}>
      {children}
      {showPopup && (
        <div 
          className="absolute z-[100] bg-bg-dark border border-node-border rounded-lg p-2 shadow-xl text-xs w-40"
          style={{ top: showPopup.y - 100, left: showPopup.x - 200, position: 'fixed' } as React.CSSProperties}
          onClick={(e) => { e.stopPropagation(); setShowPopup(null); }}
        >
          {['Copy', 'Clone', 'Paste', 'Delete', 'Lock', 'Command Palette', 'Function Index', 'Animate', 'Connect Source', 'Connect Repo'].map(item => (
            <button 
              key={item} 
              className="block w-full text-left p-2 hover:bg-white/10 rounded" 
              onClick={() => {onAction(item); setShowPopup(null);}}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
