import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { callEdge } from '@/utils/callEdge';
import { useI18n } from '@/hooks/useI18n';

interface CvDropzoneProps {
  onFileUploaded: (path: string, fileName: string) => void;
  onFileRemoved: () => void;
}

export const CvDropzone = ({ onFileUploaded, onFileRemoved }: CvDropzoneProps) => {
  const { t } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; path: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return t('upload.errors.fileType');
    }
    if (file.size > 10 * 1024 * 1024) {
      return t('upload.errors.fileSize');
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Step 1: Get signed upload URL
      const { path, upload_url } = await callEdge('/uploads/create-signed', {
        method: 'POST',
        body: JSON.stringify({
          filename: file.name,
          size_bytes: file.size,
          content_type: file.type
        }),
      });

      // Step 2: Upload file directly to storage using signed URL
      const uploadResponse = await fetch(upload_url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(t('upload.errors.uploadFailed'));
      }

      setUploadedFile({ name: file.name, path });
      onFileUploaded(path, file.name);
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('upload.errors.general');
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError(null);
    onFileRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">{t('upload.title')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('upload.description')}
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg mb-4">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>{t('upload.warning.title')}</strong>
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            {t('upload.warning.subtitle')}
          </p>
        </div>
      </div>

      {!uploadedFile ? (
        <Card
          className={`cursor-pointer transition-all duration-200 ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={t('upload.dropzone.aria')}
        >
          <CardContent className="flex flex-col items-center justify-center py-8 px-4">
            <Upload className={`h-8 w-8 mb-4 ${
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            }`} />
            
            {isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">{t('upload.dropzone.uploading')}</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium mb-1">
                  {t('upload.dropzone.drag')}
                </p>
                <p className="text-xs text-muted-foreground">{t('upload.dropzone.maxSize')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="flex items-center justify-between py-4 px-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {t('upload.success.uploaded')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-200 dark:hover:bg-green-900"
              aria-label={t('upload.success.remove')}
            >
              <X className="h-4 w-4" />
              {t('upload.success.remove')}
            </Button>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        aria-hidden="true"
      />

      {uploadedFile && (
        <div 
          className="text-sm text-green-600 dark:text-green-400"
          role="status"
          aria-live="polite"
        >
          {t('upload.success.status')}
        </div>
      )}

      {error && (
        <div 
          className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
          role="status"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};