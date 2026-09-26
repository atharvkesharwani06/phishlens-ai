import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, FileCheck } from 'lucide-react';

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
      setError('Invalid file format. Please upload a PNG, JPG, JPEG, or WEBP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds 10 MB limit.');
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
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h4 className="text-base font-semibold text-slate-100 font-mono">
              Upload Screenshot or Threat Image
            </h4>
            <p className="text-xs text-slate-400 mt-1.5 max-w-sm">
              Drag & drop a suspicious SMS, email, fake login, or social message screenshot here, or click to browse.
            </p>

            <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">PNG</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">JPG</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">WEBP</span>
              <span>• Max 10 MB</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <FileCheck className="w-4 h-4" />
              <span>{selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB)</span>
            </div>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Image Preview */}
          <div className="max-h-72 overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800">
            <img
              src={previewUrl}
              alt="Screenshot Preview"
              className="max-h-72 object-contain"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
