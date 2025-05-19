import { useState, useEffect } from 'react';
import { TimelineItem } from '../../types/TimelineItem';

type PreviewProps = {
  item: TimelineItem;
  mousePosition: { x: number; y: number };
  itemPosition: DOMRect;
};

const Preview: React.FC<PreviewProps> = ({ item, mousePosition, itemPosition }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);
  
  const centerX = itemPosition.left + itemPosition.width / 2;

  return (
    <div 
      id="preview" 
      className={`absolute bg-white shadow-lg transition-all duration-200 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{
        top: itemPosition.top - 10,
        left: centerX ?? 0,
        transform: "translate(-50%, -100%)",
        zIndex: 9999,
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-32 h-24 overflow-hidden bg-gray-100">
          <img 
            src={item.title} 
            alt={item.title || "Preview"} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;