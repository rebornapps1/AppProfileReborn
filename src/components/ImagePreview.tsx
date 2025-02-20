
import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  onRemove?: () => void;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  onRemove,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt="Preview"
        className="w-full h-full object-cover rounded-lg animate-fade-in"
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 p-1 bg-netflix-red rounded-full 
                     hover:bg-netflix-red/90 transition-colors duration-300"
        >
          <X size={16} className="text-white" />
        </button>
      )}
    </div>
  );
};
