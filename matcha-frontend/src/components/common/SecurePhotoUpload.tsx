// src/components/common/SecurePhotoUpload.tsx
import React, { useState, useCallback, useRef } from 'react';
import { Camera, X, Upload, AlertCircle, Check, RotateCw, Crop, Download } from 'lucide-react';
import { SecurityValidator } from '../../utils/securityValidation';

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  uploaded: boolean;
  uploading: boolean;
  url?: string;
  error?: string;
  isMain?: boolean;
}

interface PhotoUploadProps {
  currentPhotos: string[];
  maxPhotos?: number;
  onPhotosChange: (photos: string[]) => void;
  onMainPhotoChange?: (photoUrl: string) => void;
  className?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const MAX_PHOTOS = 5;
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 4000, height: 4000 };

export const SecurePhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhotos,
  maxPhotos = MAX_PHOTOS,
  onPhotosChange,
  onMainPhotoChange,
  className = ''
}) => {
  const [photoFiles, setPhotoFiles] = useState<PhotoFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImageFile = async (file: File): Promise<{ isValid: boolean; error?: string }> => {
    const fileValidation = SecurityValidator.validateFileUpload(file);
    if (!fileValidation.isValid) {
      return { isValid: false, error: fileValidation.errors[0] };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: 'File size cannot exceed 5MB' };
    }

    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        if (img.width < MIN_DIMENSIONS.width || img.height < MIN_DIMENSIONS.height) {
          resolve({ isValid: false, error: `Image must be at least ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} pixels` });
          return;
        }
        
        if (img.width > MAX_DIMENSIONS.width || img.height > MAX_DIMENSIONS.height) {
          resolve({ isValid: false, error: `Image cannot exceed ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels` });
          return;
        }

        try {
          canvas.width = 100;
          canvas.height = 100;
          ctx?.drawImage(img, 0, 0, 100, 100);
          const imageData = ctx?.getImageData(0, 0, 100, 100);
          
          if (!imageData || imageData.data.length === 0) {
            resolve({ isValid: false, error: 'Invalid image file' });
            return;
          }
          
          resolve({ isValid: true });
        } catch (error) {
          resolve({ isValid: false, error: 'Corrupted image file' });
        }
      };
      
      img.onerror = () => {
        resolve({ isValid: false, error: 'Invalid image file' });
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const generateSecureFilename = (originalName: string): string => {
    const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = sanitized.split('.').pop() || 'jpg';
    return `profile_${timestamp}_${random}.${extension}`;
  };

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    setError('');
    const fileArray = Array.from(files);
    
    if (currentPhotos.length + photoFiles.length + fileArray.length > maxPhotos) {
      setError(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    for (const file of fileArray) {
      const photoId = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const validation = await validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        continue;
      }

      const preview = URL.createObjectURL(file);
      
      const secureFilename = generateSecureFilename(file.name);
      const secureFile = new File([file], secureFilename, { type: file.type });
      
      const photoFile: PhotoFile = {
        id: photoId,
        file: secureFile,
        preview,
        uploaded: false,
        uploading: false
      };

      setPhotoFiles(prev => [...prev, photoFile]);
      
      uploadPhoto(photoFile);
    }
  }, [currentPhotos.length, photoFiles.length, maxPhotos]);

  const uploadPhoto = async (photoFile: PhotoFile) => {
    setPhotoFiles(prev => prev.map(p => 
      p.id === photoFile.id ? { ...p, uploading: true } : p
    ));

    try {
      const formData = new FormData();
      formData.append('photo', photoFile.file);
      formData.append('photoId', photoFile.id);
      formData.append('checksum', await calculateFileChecksum(photoFile.file));

      const response = await fetch('/api/upload/profile-photo', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Upload-Source': 'profile-photos',
          'X-File-Type': photoFile.file.type
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      
      setPhotoFiles(prev => prev.map(p => 
        p.id === photoFile.id 
          ? { ...p, uploaded: true, uploading: false, url: result.url }
          : p
      ));

      const newPhotos = [...currentPhotos, result.url];
      onPhotosChange(newPhotos);

      if (currentPhotos.length === 0 && onMainPhotoChange) {
        onMainPhotoChange(result.url);
      }

    } catch (error) {
      console.error('Photo upload failed:', error);
      setPhotoFiles(prev => prev.map(p => 
        p.id === photoFile.id 
          ? { ...p, uploading: false, error: error instanceof Error ? error.message : 'Upload failed' }
          : p
      ));
    }
  };

  const calculateFileChecksum = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const removePhoto = useCallback(async (photoUrl: string, isFromServer = true) => {
    try {
      if (isFromServer) {
        await fetch('/api/upload/profile-photo', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ photoUrl })
        });

        const newPhotos = currentPhotos.filter(url => url !== photoUrl);
        onPhotosChange(newPhotos);
      } else {
        setPhotoFiles(prev => {
          const photo = prev.find(p => p.preview === photoUrl);
          if (photo?.preview) {
            URL.revokeObjectURL(photo.preview);
          }
          return prev.filter(p => p.preview !== photoUrl);
        });
      }
    } catch (error) {
      console.error('Failed to remove photo:', error);
      setError('Failed to remove photo');
    }
  }, [currentPhotos, onPhotosChange]);

  const setMainPhoto = useCallback(async (photoUrl: string) => {
    try {
      await fetch('/api/user/main-photo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ photoUrl })
      });

      if (onMainPhotoChange) {
        onMainPhotoChange(photoUrl);
      }
    } catch (error) {
      console.error('Failed to set main photo:', error);
      setError('Failed to set main photo');
    }
  }, [onMainPhotoChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const allPhotos = [
    ...currentPhotos.map(url => ({ url, uploaded: true, isServer: true })),
    ...photoFiles.map(pf => ({ 
      url: pf.preview, 
      uploaded: pf.uploaded, 
      uploading: pf.uploading, 
      error: pf.error,
      isServer: false,
      photoFile: pf
    }))
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragOver 
            ? 'border-pink-400 bg-pink-50' 
            : 'border-gray-300 hover:border-pink-300 hover:bg-gray-50'
        } ${allPhotos.length >= maxPhotos ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (allPhotos.length < maxPhotos && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        <Camera className="mx-auto mb-2 text-gray-400" size={32} />
        <p className="text-gray-600 font-medium">
          {allPhotos.length >= maxPhotos 
            ? `Maximum ${maxPhotos} photos reached`
            : 'Upload up to 5 photos'
          }
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Drag & drop or click to browse • JPEG, PNG, WebP • Max 5MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={allPhotos.length >= maxPhotos}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="text-red-500" size={16} />
          <span className="text-sm text-red-700">{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {allPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {allPhotos.map((photo, index) => (
            <div key={photo.url} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={photo.url}
                  alt={`Profile photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {photo.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Upload className="animate-spin mx-auto mb-2" size={24} />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  </div>
                )}
                
                {photo.error && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                    <div className="text-white text-center p-2">
                      <AlertCircle className="mx-auto mb-2" size={24} />
                      <span className="text-xs">{photo.error}</span>
                    </div>
                  </div>
                )}
                
                {photo.uploaded && !photo.uploading && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <Check className="text-white" size={12} />
                  </div>
                )}
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg">
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index === 0 && (
                    <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded">
                      Main
                    </span>
                  )}
                </div>
                
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  {index !== 0 && photo.uploaded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainPhoto(photo.url);
                      }}
                      className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                      title="Set as main photo"
                    >
                      <Camera size={12} />
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.url, photo.isServer);
                    }}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    title="Remove photo"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {photoFiles.some(pf => pf.uploading) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Upload className="text-blue-500 animate-spin" size={16} />
            <span className="text-sm text-blue-700">
              Uploading {photoFiles.filter(pf => pf.uploading).length} photo(s)...
            </span>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="font-medium text-gray-800 mb-2">Photo Requirements:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• At least 200x200 pixels, maximum 4000x4000 pixels</li>
          <li>• JPEG, PNG, or WebP format only</li>
          <li>• Maximum 5MB per photo</li>
          <li>• Clear, recent photos of yourself</li>
          <li>• No group photos or images with multiple people</li>
        </ul>
      </div>
    </div>
  );
};
