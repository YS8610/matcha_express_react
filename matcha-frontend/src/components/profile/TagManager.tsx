'use client';

import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { api } from '@/lib/api';

interface TagManagerProps {
  className?: string;
}

export default function TagManager({ className = '' }: TagManagerProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await api.getUserTags();
      setTags(response.tags || []);
      setError('');
    } catch (err) {
      console.warn('Failed to load tags:', err);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    try {
      setAdding(true);
      setError('');
      await api.addTag(newTag.trim());
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    } catch (err) {
      setError((err as Error).message || 'Failed to add tag');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    try {
      await api.removeTag(tagToRemove);
      setTags(tags.filter(tag => tag !== tagToRemove));
    } catch (err) {
      setError((err as Error).message || 'Failed to remove tag');
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-green-700">Your Tags</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded-full w-16"></div>
            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
            <div className="h-8 bg-gray-200 rounded-full w-14"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-green-700">Your Tags</h3>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-gray-600">Current tags ({tags.length}/10):</p>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
                  title="Remove tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No tags yet. Add some to describe your interests!</p>
        )}
      </div>

      {tags.length < 10 && (
        <form onSubmit={handleAddTag} className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a new tag..."
            className="flex-1 px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
            maxLength={20}
            disabled={adding}
          />
          <button
            type="submit"
            disabled={adding || !newTag.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            {adding ? 'Adding...' : 'Add'}
          </button>
        </form>
      )}

      {tags.length >= 10 && (
        <p className="text-amber-600 text-sm">
          You&apos;ve reached the maximum number of tags (10). Remove a tag to add a new one.
        </p>
      )}

      <div className="text-xs text-gray-500">
        <p>Tips:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Tags help others find you based on common interests</li>
          <li>Use descriptive keywords like hobbies, interests, or skills</li>
          <li>Keep tags concise and relevant</li>
        </ul>
      </div>
    </div>
  );
}
