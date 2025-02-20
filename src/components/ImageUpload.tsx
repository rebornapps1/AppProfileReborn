
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  label: string;
  accept?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  label,
  accept = "image/*"
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        id={`file-${label}`}
      />
      <label
        htmlFor={`file-${label}`}
        className="netflix-button flex items-center gap-2 cursor-pointer"
      >
        <Upload size={20} />
        {label}
      </label>
    </div>
  );
};
