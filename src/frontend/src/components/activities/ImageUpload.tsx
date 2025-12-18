/**
 * ImageUpload - Image upload/URL input component
 * Single Responsibility: Handle campaign image
 */

import { Upload } from 'lucide-react';

interface ImageUploadProps {
  imageUrl: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ imageUrl, onChange }: ImageUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#213547] mb-1.5 font-['Open_Sans']">
        Ảnh minh họa <span className="text-slate-400">(không bắt buộc)</span>
      </label>
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
        <Upload size={32} className="mx-auto text-slate-400 mb-3" />
        <p className="font-medium text-[#213547] mb-1 font-['Open_Sans']">Drag & Drop hoặc Upload</p>
        <p className="text-xs text-slate-500 mb-3">PNG, JPG – tối đa 5MB</p>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Hoặc nhập URL ảnh..."
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#535bf2] focus:border-[#535bf2] bg-white font-['Open_Sans']"
        />
      </div>
      {imageUrl && (
        <div className="mt-3">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-slate-200"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}
