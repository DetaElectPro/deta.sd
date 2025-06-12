import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Calendar, 
  HardDrive,
  Image as ImageIcon
} from 'lucide-react';

interface FileInfoProps {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  uploadDate?: string;
  url?: string;
  filePath?: string;
  className?: string;
}

export const FileInfo = ({
  fileName,
  fileSize,
  fileType,
  uploadDate,
  url,
  filePath,
  className
}: FileInfoProps) => {
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'غير محدد';
    
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type?: string) => {
    if (!type) return <FileText className="h-4 w-4" />;
    
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    
    return <FileText className="h-4 w-4" />;
  };

  const getFileTypeBadge = (type?: string) => {
    if (!type) return null;
    
    const typeMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      'image/jpeg': { label: 'JPEG', variant: 'default' },
      'image/png': { label: 'PNG', variant: 'default' },
      'image/webp': { label: 'WebP', variant: 'secondary' },
      'image/gif': { label: 'GIF', variant: 'outline' },
    };

    const config = typeMap[type] || { label: type.split('/')[1]?.toUpperCase() || 'Unknown', variant: 'outline' as const };
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const handleDownload = () => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNewTab = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (!fileName && !url && !filePath) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getFileTypeIcon(fileType)}
          معلومات الملف
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {fileName && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">اسم الملف:</span>
            <span className="text-sm font-medium truncate max-w-[200px]" title={fileName}>
              {fileName}
            </span>
          </div>
        )}

        {fileType && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">نوع الملف:</span>
            {getFileTypeBadge(fileType)}
          </div>
        )}

        {fileSize && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              الحجم:
            </span>
            <span className="text-sm font-medium">
              {formatFileSize(fileSize)}
            </span>
          </div>
        )}

        {uploadDate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              تاريخ الرفع:
            </span>
            <span className="text-sm font-medium">
              {new Date(uploadDate).toLocaleDateString('ar-SA')}
            </span>
          </div>
        )}

        {filePath && (
          <div className="space-y-1">
            <span className="text-sm text-gray-600">مسار الملف:</span>
            <code className="text-xs bg-gray-100 p-1 rounded block break-all">
              {filePath}
            </code>
          </div>
        )}

        {url && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="h-3 w-3 mr-1" />
              تحميل
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenInNewTab}
              className="flex-1"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              فتح
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
