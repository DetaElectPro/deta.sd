import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUploadComplete: (url: string, path: string) => void;
  currentImageUrl?: string;
  className?: string;
  bucket?: string;
  folder?: string;
  maxSizeInMB?: number;
  disabled?: boolean;
}

export const ImageUploader = ({
  onUploadComplete,
  currentImageUrl,
  className,
  bucket = 'background-images',
  folder = 'uploads',
  maxSizeInMB = 10,
  disabled = false
}: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, uploading, progress } = useFileUpload();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled || uploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    setSelectedFile(file);
    
    // إنشاء معاينة للصورة
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadFile(selectedFile, {
        bucket,
        folder,
        maxSizeInMB,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });

      onUploadComplete(result.url, result.path);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Label>صورة الخلفية</Label>
      
      {/* منطقة رفع الصور */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300",
          disabled || uploading ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400",
          previewUrl ? "border-solid" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || uploading}
        />

        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="معاينة الصورة"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              disabled={disabled || uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                اسحب وأفلت الصورة هنا، أو انقر للاختيار
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP حتى {maxSizeInMB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* شريط التقدم */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>جاري رفع الصورة...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* معلومات الملف المحدد */}
      {selectedFile && !uploading && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={disabled}
              size="sm"
            >
              <Upload className="h-4 w-4 ml-1" />
              رفع
            </Button>
          </div>
        </div>
      )}

      {/* رسالة تحذيرية */}
      <div className="flex items-start space-x-2 text-xs text-gray-500">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div>
          <p>تأكد من أن الصورة ذات جودة عالية ومناسبة للعرض كخلفية.</p>
          <p>الأبعاد المثلى: 1920x1080 بكسل أو أعلى.</p>
        </div>
      </div>
    </div>
  );
};
