import { useState, useRef } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ImagePreview } from '@/components/ImagePreview';
import { Button } from '@/components/ui/button';
import { Download, Link, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [icons, setIcons] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const loadImageFromUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Verificar se é uma imagem válida
    const isValid = await validateImage(blob as File);
    if (!isValid) {
      throw new Error('Invalid image file');
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 115;
        canvas.height = 115;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 115, 115);
          resolve(canvas.toDataURL());
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(blob);
    });
  };

  const handleAvatarUrl = async () => {
    try {
      const imageData = await loadImageFromUrl(avatarUrl);
      setAvatar(imageData);
      setAvatarUrl('');
      toast.success('Avatar loaded from URL successfully');
    } catch (error) {
      toast.error('Invalid image URL or format. Please try again.');
    }
  };

  const handleAvatarSelect = async (file: File) => {
    try {
      const isValid = await validateImage(file);
      if (!isValid) {
        toast.error('Invalid image file. Please select a valid image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 115;
          canvas.height = 115;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 115, 115);
            setAvatar(canvas.toDataURL());
            toast.success('Avatar uploaded successfully');
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to load image. Please try again.');
    }
  };

  const handleIconSelect = async (file: File) => {
    try {
      if (icons.length >= 5) {
        toast.error('Maximum of 5 icons allowed');
        return;
      }

      const isValid = await validateImage(file);
      if (!isValid) {
        toast.error('Invalid image file. Please select a valid image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 115;
          canvas.height = 115;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 115, 115);
            setIcons((prev) => [...prev, canvas.toDataURL()]);
            toast.success('Icon added successfully');
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to load image. Please try again.');
    }
  };

  const handleRemoveIcon = (index: number) => {
    setIcons((prev) => prev.filter((_, i) => i !== index));
    toast.success('Icon removed successfully');
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    toast.success('Avatar removed successfully');
  };

  const handleExport = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size based on number of images (avatar + icons)
      canvas.width = 115;
      canvas.height = 115 + (icons.length * 115);

      // Draw avatar
      if (avatar) {
        const avatarImg = new Image();
        await new Promise((resolve) => {
          avatarImg.onload = resolve;
          avatarImg.src = avatar;
        });
        ctx.drawImage(avatarImg, 0, 0);
      }

      // Draw icons
      for (let i = 0; i < icons.length; i++) {
        const iconImg = new Image();
        await new Promise((resolve) => {
          iconImg.onload = resolve;
          iconImg.src = icons[i];
        });
        ctx.drawImage(iconImg, 0, 115 + (i * 115));
      }

      // Download the image
      const link = document.createElement('a');
      link.download = 'avatar-icons.png';
      link.href = canvas.toDataURL();
      link.click();
      toast.success('Layout exported successfully');
    } catch (error) {
      toast.error('Failed to export layout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="netflix-card w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 animate-fade-in">
          Avatar & Icons
        </h1>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <ImageUpload
                  onImageSelect={handleAvatarSelect}
                  label="Upload Avatar"
                  accept="image/png"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Link className="mr-2 h-4 w-4" />
                      Add Avatar from URL
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Avatar from URL</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="Enter image URL"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                      />
                      <Button onClick={handleAvatarUrl}>Add</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {avatar && (
                <div className="w-[115px] h-[115px] mx-auto">
                  <ImagePreview
                    src={avatar}
                    onRemove={handleRemoveAvatar}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <ImageUpload
                onImageSelect={handleIconSelect}
                label="Add Icon"
                accept="image/png"
              />
              <p className="text-sm text-white/60">
                {5 - icons.length} icons remaining
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div ref={previewRef} className="flex flex-col items-center gap-0">
              {avatar && (
                <div className="w-[115px] h-[115px] relative group">
                  <img
                    src={avatar}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 p-1 bg-netflix-red rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              )}
              {icons.map((icon, index) => (
                <div key={index} className="w-[115px] h-[115px] relative group">
                  <img
                    src={icon}
                    alt={`Icon ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveIcon(index)}
                    className="absolute -top-2 -right-2 p-1 bg-netflix-red rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleExport}
            disabled={!avatar && icons.length === 0}
            className="netflix-button flex items-center gap-2"
          >
            <Download size={20} />
            Export Layout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
