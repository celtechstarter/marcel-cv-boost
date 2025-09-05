import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, X, AlertTriangle } from 'lucide-react';
import { callEdge } from '@/utils/callEdge';

interface SecureFileUploadProps {
  email: string;
  onUploadSuccess?: (uploadId: string) => void;
  onUploadError?: (error: string) => void;
}

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  email,
  onUploadSuccess,
  onUploadError
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setStatusMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return 'Nur PDF-Dateien sind erlaubt.';
    }

    // Check file size (10MB max)
    if (file.size > 10485760) {
      return 'Datei zu groß. Maximal 10 MB sind erlaubt.';
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setStatusMessage(validationError);
      setUploadStatus('error');
      onUploadError?.(validationError);
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setStatusMessage('');

    try {
      // Step 1: Get signed upload URL
      const { uploadUrl, uploadId, storagePath } = await callEdge('/uploads/create-signed', {
        method: 'POST',
        body: JSON.stringify({
          filename: file.name,
          email: email
        })
      });

      // Step 2: Upload file directly to Supabase Storage
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': 'application/pdf',
          'Cache-Control': 'max-age=3600'
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload fehlgeschlagen');
      }

      // Step 3: Confirm upload and store metadata
      await callEdge('/uploads/confirm', {
        method: 'POST',
        body: JSON.stringify({
          uploadId,
          storagePath,
          email,
          originalFilename: file.name,
          fileSize: file.size
        })
      });

      setUploadedFile(file);
      setUploadStatus('success');
      setStatusMessage('Datei erfolgreich hochgeladen');
      onUploadSuccess?.(uploadId);

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload fehlgeschlagen';
      setStatusMessage(errorMessage);
      setUploadStatus('error');
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          ${uploadStatus === 'success' ? 'border-green-500 bg-green-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={uploadStatus !== 'success' ? openFileDialog : undefined}
        role="button"
        tabIndex={0}
        aria-label="Lebenslauf als PDF hochladen"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && uploadStatus !== 'success') {
            e.preventDefault();
            openFileDialog();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="PDF-Datei auswählen"
        />

        {uploadStatus === 'success' && uploadedFile ? (
          <div className="flex items-center justify-center space-x-3">
            <FileText className="w-8 h-8 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-800">
                {uploadedFile.name}
              </p>
              <p className="text-sm text-green-600">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                resetUpload();
              }}
              aria-label="Upload entfernen"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium">
                Lebenslauf als PDF hochladen (optional)
              </p>
              <p className="text-sm text-gray-600">
                {isUploading 
                  ? 'Datei wird hochgeladen...' 
                  : 'Ziehe die Datei hierher oder klicke, um zu wählen. Max. 10 MB.'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Wichtiger Hinweis:</strong> Bitte keine medizinischen Diagnosen hochladen – 
          falls doch, ist deine ausdrückliche Einwilligung erforderlich. 
          Keine sensiblen Gesundheitsdaten oder Dokumente Dritter.
        </AlertDescription>
      </Alert>

      {/* Status Messages */}
      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-sm ${
            uploadStatus === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      )}

      {/* Microcopy */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          Wenn du schon einen Lebenslauf hast, kannst du ihn hier als PDF hochladen. 
          So kann ich mich vorab einlesen und dir schneller helfen.
        </p>
        <p>
          <strong>Datenschutz:</strong> Dateien werden verschlüsselt in der EU gespeichert 
          und nach 90 Tagen automatisch gelöscht.
        </p>
      </div>
    </div>
  );
};