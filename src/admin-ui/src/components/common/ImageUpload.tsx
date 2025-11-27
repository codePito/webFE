import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
interface ImageUploadProps {
  label?: string;
  value: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  error?: string;
}
export function ImageUpload({
  label,
  value,
  onChange,
  maxImages = 5,
  error
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newImages: string[] = [];
    const remainingSlots = maxImages - value.length;
    Array.from(files).slice(0, remainingSlots).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === Math.min(files.length, remainingSlots)) {
              onChange([...value, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  return <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>}

      {/* Upload Area */}
      {value.length < maxImages && <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary-500 bg-primary-50' : error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}`}>
          <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB ({value.length}/{maxImages} images)
          </p>
        </div>}

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={e => handleFileSelect(e.target.files)} className="hidden" />

      {/* Image Preview Grid */}
      {value.length > 0 && <div className="grid grid-cols-3 gap-3 mt-3">
          {value.map((image, index) => <div key={index} className="relative group aspect-square">
              <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
              <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
              {index === 0 && <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary-600 text-white text-xs font-medium rounded">
                  Primary
                </div>}
            </div>)}
        </div>}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>;
}