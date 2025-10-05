'use client';

import { useState, useEffect } from 'react';
import { Upload, X, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';
import imageCompression from 'browser-image-compression';

interface PhotoManagerProps {
  className?: string;
}

export default function PhotoManager({ className = '' }: PhotoManagerProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await api.getUserPhotos();
      setPhotos(response.photoNames || []);
    } catch (err) {
      setError((err as Error).message || 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (photoNumber: number, file: File) => {
    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const options = {
        maxSizeMB: 0.095,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/jpeg',
      };

      const compressedFile = await imageCompression(file, options);

      await api.uploadPhoto(compressedFile, photoNumber);
      await loadPhotos();
      setSuccess('Photo uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError((err as Error).message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoDelete = async (photoNumber: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      setError('');
      setSuccess('');
      await api.deletePhoto(photoNumber);
      await loadPhotos();
      setSuccess('Photo deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError((err as Error).message || 'Failed to delete photo');
    }
  };

  const handlePhotoReorder = async (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= 5) return;

    try {
      setError('');
      const newOrder = [...Array(5).keys()];
      [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];

      await api.reorderPhotos(newOrder);
      await loadPhotos();
      setSuccess('Photos reordered successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError((err as Error).message || 'Failed to reorder photos');
    }
  };

  const handleFileInput = (photoNumber: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handlePhotoUpload(photoNumber, file);
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-green-700">Your Photos</h3>
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-green-700">Your Photos</h3>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>
      )}

      {success && (
        <div className="text-green-500 text-sm bg-green-50 p-3 rounded-md">{success}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => {
          const photoName = photos[index];
          const hasPhoto = photoName && photoName.trim() !== '';

          return (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg border-2 border-green-300 overflow-hidden bg-gray-50">
                {hasPhoto ? (
                  <>
                    <Image
                      src={api.getPhoto(photoName)}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePhotoDelete(index)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                        title="Delete photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index > 0 && (
                        <button
                          onClick={() => handlePhotoReorder(index, 'up')}
                          className="opacity-0 group-hover:opacity-100 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                      )}
                      {index < 4 && (
                        <button
                          onClick={() => handlePhotoReorder(index, 'down')}
                          className="opacity-0 group-hover:opacity-100 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleFileInput(index)}
                    disabled={uploading}
                    className="w-full h-full flex flex-col items-center justify-center text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-xs">Upload</span>
                  </button>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-gray-500">
        <p className="font-medium mb-1">Photo Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Upload up to 5 photos to showcase yourself</li>
          <li>Your first photo will be your main profile picture</li>
          <li>Use clear, recent photos for best results</li>
          <li>Photos are automatically compressed for optimal performance</li>
        </ul>
      </div>
    </div>
  );
}
