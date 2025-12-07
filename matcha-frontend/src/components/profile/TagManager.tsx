'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { UserTagsResponse } from '@/types';
import TagSelector from '@/components/TagSelector';

interface TagManagerProps {
  className?: string;
}

export default function TagManager({ className = '' }: TagManagerProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const [addedTags, setAddedTags] = useState<string[]>([]);
  const [removedTags, setRemovedTags] = useState<string[]>([]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await api.getUserTags() as UserTagsResponse;
      setTags(response.tags || []);
      setError('');
    } catch (err) {
      console.warn('Failed to load tags:', err);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = async (newTags: string[]) => {
    const currentTags = tags;

    const added = newTags.filter(tag => !currentTags.includes(tag));
    const removed = currentTags.filter(tag => !newTags.includes(tag));

    for (const tag of added) {
      try {
        await api.addTag(tag);
        addToast(`Tag "${tag}" added`, 'success', 2000);
      } catch (err) {
        const errorMsg = (err as Error).message || 'Failed to add tag';
        addToast(errorMsg, 'error', 3000);
        return; 
      }
    }

    for (const tag of removed) {
      try {
        await api.removeTag(tag);
        addToast(`Tag "${tag}" removed`, 'success', 2000);
      } catch (err) {
        const errorMsg = (err as Error).message || 'Failed to remove tag';
        addToast(errorMsg, 'error', 3000);
        return; 
      }
    }

    setTags(newTags);
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">Manage Your Interests</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-1">Manage Your Interests</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add tags that describe your interests and hobbies. These help others find you!
        </p>
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
          {error}
        </div>
      )}

      <TagSelector
        selectedTags={tags}
        onTagsChange={handleTagsChange}
        maxTags={5}
        minTags={0}
        placeholder="Type to add interests (e.g., vegan, geek, piercing)..."
        showPopular={true}
        popularTagsCount={20}
      />
    </div>
  );
}
