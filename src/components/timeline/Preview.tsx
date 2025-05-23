"use client";

import { TimelineItem } from '../../types/TimelineItem';

type PreviewProps = {
  item: TimelineItem;
  itemPosition: DOMRect;
};

const Preview: React.FC<PreviewProps> = ({ item, itemPosition }) => {
  const centerX = itemPosition.left + itemPosition.width / 2;

  return (
    <div 
      id="preview" 
      className="absolute bg-transparent shadow-lg"
      style={{
        top: itemPosition.top - 10,
        left: centerX ?? 0,
        transform: "translate(-50%, -100%)",
        zIndex: 1,
        animation: 'popUp 0.12s ease-out forwards'
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-48 h-36 flex items-center justify-center">
          <img 
            src={item.title || "placeholder"} 
            alt={item.title || "Preview"} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes popUp {
          0% {
            opacity: 0;
            transform: translate(-50%, -100%) scale(0.75) translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -100%) scale(1) translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default Preview;