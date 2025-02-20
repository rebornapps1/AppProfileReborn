
import React from 'react';
import { ImagePreview } from './ImagePreview';

interface IconListProps {
  icons: string[];
  onRemoveIcon: (index: number) => void;
}

export const IconList: React.FC<IconListProps> = ({ icons, onRemoveIcon }) => {
  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-[200px]">
      {icons.map((icon, index) => (
        <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
          <ImagePreview
            src={icon}
            onRemove={() => onRemoveIcon(index)}
            className="w-12 h-12"
          />
        </div>
      ))}
    </div>
  );
};
