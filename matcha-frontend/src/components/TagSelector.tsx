'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Tag as TagIcon, Check, AlertTriangle } from 'lucide-react';
import { getTagSuggestions, getRandomPopularTags, POPULAR_TAGS } from '@/lib/popularTags';
import { validateTag } from '@/lib/validation';
import { USER_MAX_TAGS } from '@/constants';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  minTags?: number;
  placeholder?: string;
  showPopular?: boolean;
  popularTagsCount?: number;
  error?: string;
}

export default function TagSelector({
  selectedTags,
  onTagsChange,
  maxTags = USER_MAX_TAGS,
  minTags = 1,
  placeholder = 'Add interest...',
  showPopular = true,
  popularTagsCount = 15,
  error,
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showPopular) {
      setPopularTags(getRandomPopularTags(popularTagsCount, selectedTags));
    }
  }, [showPopular, popularTagsCount, selectedTags]);

  useEffect(() => {
    if (inputValue.trim()) {
      const newSuggestions = getTagSuggestions(inputValue, selectedTags);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, selectedTags]);

  const handleAddTag = (tag: string) => {
    const lowerTag = tag.toLowerCase().trim();

    if (!lowerTag) {
      setLocalError('Please enter a tag');
      return;
    }

    if (selectedTags.includes(lowerTag)) {
      setLocalError('This tag is already added');
      return;
    }

    if (selectedTags.length >= maxTags) {
      setLocalError(`Maximum ${maxTags} tags allowed`);
      return;
    }

    const tagError = validateTag(lowerTag);
    if (tagError) {
      setLocalError(tagError);
      return;
    }

    onTagsChange([...selectedTags, lowerTag]);
    setInputValue('');
    setLocalError('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedTags.length < maxTags) {
        handleAddTag(inputValue);
      }
    }
  };

  const handleSuggestionClick = (tag: string) => {
    handleAddTag(tag);
  };

  const isMaxReached = selectedTags.length >= maxTags;
  const displayError = error || localError;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              disabled={isMaxReached}
              className={`w-full px-4 py-2 border rounded-lg ${
                isMaxReached
                  ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
              placeholder={isMaxReached ? `Maximum ${maxTags} tags reached` : placeholder}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {suggestions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSuggestionClick(tag)}
                    className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors flex items-center gap-2"
                  >
                    <TagIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">#{tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleAddTag(inputValue)}
            disabled={isMaxReached || !inputValue.trim()}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isMaxReached || !inputValue.trim()
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
            }`}
          >
            Add
          </button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span
            className={`text-xs font-medium ${
              selectedTags.length >= maxTags
                ? 'text-red-600 dark:text-red-400'
                : selectedTags.length >= minTags
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {selectedTags.length}/{maxTags} tags
            {selectedTags.length < minTags && ` (minimum ${minTags} required)`}
          </span>

          {displayError && (
            <span className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {displayError}
            </span>
          )}
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-3 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-green-800 dark:text-emerald-200 border border-green-300 dark:border-emerald-700 rounded-full text-sm flex items-center gap-2 transition-all hover:shadow-md"
              >
                <TagIcon className="w-3 h-3" />
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold hover:scale-125 transition-transform"
                  title="Remove tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {showPopular && popularTags.length > 0 && selectedTags.length < maxTags && (
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">
              Popular Tags - Click to Add
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                disabled={isMaxReached}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isMaxReached
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:shadow-md active:scale-95'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {isMaxReached && (
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          ℹ You&apos;ve reached the maximum number of tags ({maxTags}). Remove one to add a different tag.
        </p>
      )}
    </div>
  );
}
