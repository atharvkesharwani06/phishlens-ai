import React, { useState, useRef } from 'react';
import { UploadCloud, X, AlertCircle, FileCheck } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  isLoading?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  selectedFile,
  onClear,
  isLoading = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setError(null);
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid format. Please upload a PNG, JPG, JPEG, or WEBP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds the 10 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            validateAndProcessFile(e.target.files[0]);
          }
        }}
      />

      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#087F75] bg-[#E6F4F1]/40 scale-[1.008] shadow-xs'
              : 'border-[#E2E8E5] hover:border-[#087F75]/40 bg-[#FFFFFF] hover:bg-[#F7F8F6]/60'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-lg bg-[#E6F4F1] border border-[#087F75]/20 flex items-center justify-center text-[#087F75] mb-3 group-hover:-translate-y-0.5 group-hover:shadow-xs transition-all duration-200">
              <UploadCloud className="w-6 h-6" />
            </div>

            <h4 className="text-sm font-semibold text-[#172321] font-sans">
              Upload Screenshot or Image Artifact
            </h4>
            <p className="text-xs text-[#697773] mt-1 max-w-sm font-sans">
              Drag and drop an SMS, email, login prompt, or suspicious message capture, or click to browse.
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-[#697773]">
              <span className="px-2 py-0.5 rounded bg-[#F7F8F6] border border-[#E2E8E5]">PNG</span>
              <span className="px-2 py-0.5 rounded bg-[#F7F8F6] border border-[#E2E8E5]">JPG</span>
              <span className="px-2 py-0.5 rounded bg-[#F7F8F6] border border-[#E2E8E5]">WEBP</span>
              <span>• Max 10 MB</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] p-4 relative overflow-hidden shadow-xs animate-fade-in">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8E5]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#087F75]">
              <FileCheck className="w-4 h-4 text-[#087F75]" />
              <span>{selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB)</span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="text-[#697773] hover:text-[#C74747] p-1 rounded hover:bg-[#F7F8F6] active:scale-90 transition-all duration-150 cursor-pointer"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-72 overflow-hidden rounded-lg bg-[#F7F8F6] flex items-center justify-center border border-[#E2E8E5]">
            <img
              src={previewUrl}
              alt="Screenshot Preview"
              className="max-h-72 object-contain"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#C74747]/8 border border-[#C74747]/25 text-[#C74747] text-xs font-sans">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C74747]" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
