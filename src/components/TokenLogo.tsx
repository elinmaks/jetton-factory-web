
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TokenLogoProps {
  logo: string | File | null;
  onChange: (logo: File | null) => void;
  className?: string;
}

const TokenLogo = ({ logo, onChange, className }: TokenLogoProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    typeof logo === 'string' ? logo : null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      setPreviewUrl(null);
      onChange(null);
    }
  };

  const clearLogo = () => {
    setPreviewUrl(null);
    onChange(null);
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-ton-blue bg-ton-card flex items-center justify-center mb-2 group">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Token logo preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={clearLogo}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <X className="w-8 h-8 text-white" />
            </button>
          </>
        ) : (
          <ImageIcon className="w-10 h-10 text-gray-400" />
        )}
      </div>
      
      <label className="cursor-pointer flex items-center gap-1.5 text-sm font-medium text-ton-blue hover:text-ton-lightBlue transition-colors">
        <Upload className="w-4 h-4" />
        Upload Logo
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default TokenLogo;
