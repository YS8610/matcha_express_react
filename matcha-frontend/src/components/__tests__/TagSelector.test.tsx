import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagSelector from '../TagSelector';

vi.mock('@/lib/popularTags', () => ({
  getTagSuggestions: (input: string, selectedTags: string[]) => {
    const mockSuggestions = ['coding', 'coffee', 'cooking', 'cats'];
    return mockSuggestions.filter(tag =>
      tag.startsWith(input.toLowerCase()) && !selectedTags.includes(tag)
    );
  },
  getRandomPopularTags: (count: number, excludeTags: string[]) => {
    const popularTags = ['travel', 'music', 'sports', 'reading', 'gaming'];
    return popularTags.filter(tag => !excludeTags.includes(tag)).slice(0, count);
  },
  POPULAR_TAGS: ['travel', 'music', 'sports', 'reading', 'gaming'],
}));

vi.mock('@/lib/validation', () => ({
  validateTag: (tag: string) => {
    if (tag.length < 2) return 'Tag must be at least 2 characters';
    if (tag.length > 20) return 'Tag must be at most 20 characters';
    if (!/^[a-z0-9]+$/.test(tag)) return 'Tag can only contain letters and numbers';
    return null;
  },
}));

describe('TagSelector Component', () => {
  const mockOnTagsChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render input field', () => {
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      expect(screen.getByPlaceholderText('Add interest...')).toBeInTheDocument();
    });

    it('should render add button', () => {
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('should show tag counter', () => {
      render(
        <TagSelector
          selectedTags={['travel']}
          onTagsChange={mockOnTagsChange}
        />
      );

      expect(screen.getByText(/1\/10 tags/i)).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
          placeholder="Type your interest"
        />
      );

      expect(screen.getByPlaceholderText('Type your interest')).toBeInTheDocument();
    });
  });

  describe('Adding Tags', () => {
    it('should add tag when clicking Add button', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      const addButton = screen.getByRole('button', { name: 'Add' });

      await user.type(input, 'travel');
      await user.click(addButton);

      expect(mockOnTagsChange).toHaveBeenCalledWith(['travel']);
    });

    it('should add tag when pressing Enter', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      await user.type(input, 'music{Enter}');

      expect(mockOnTagsChange).toHaveBeenCalledWith(['music']);
    });

    it('should convert tags to lowercase', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      await user.type(input, 'TRAVEL{Enter}');

      expect(mockOnTagsChange).toHaveBeenCalledWith(['travel']);
    });

    it('should trim whitespace from tags', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      await user.type(input, '  travel  {Enter}');

      expect(mockOnTagsChange).toHaveBeenCalledWith(['travel']);
    });

    it('should clear input after adding tag', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...') as HTMLInputElement;
      await user.type(input, 'travel{Enter}');

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('Removing Tags', () => {
    it('should remove tag when clicking X button', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={['travel', 'music']}
          onTagsChange={mockOnTagsChange}
        />
      );

      const removeButtons = screen.getAllByTitle('Remove tag');
      await user.click(removeButtons[0]);

      expect(mockOnTagsChange).toHaveBeenCalledWith(['music']);
    });

    it('should display all selected tags', () => {
      render(
        <TagSelector
          selectedTags={['travel', 'music', 'sports']}
          onTagsChange={mockOnTagsChange}
        />
      );

      expect(screen.getByText('#travel')).toBeInTheDocument();
      expect(screen.getByText('#music')).toBeInTheDocument();
      expect(screen.getByText('#sports')).toBeInTheDocument();
    });

    it('should show tag count for selected tags', () => {
      render(
        <TagSelector
          selectedTags={['travel', 'music']}
          onTagsChange={mockOnTagsChange}
        />
      );

      expect(screen.getByText('2 tags selected')).toBeInTheDocument();
    });

    it('should use singular form for single tag', () => {
      render(
        <TagSelector
          selectedTags={['travel']}
          onTagsChange={mockOnTagsChange}
        />
      );

      expect(screen.getByText('1 tag selected')).toBeInTheDocument();
    });
  });

  describe('Validation and Errors', () => {
    it('should disable add button when input is empty', async () => {
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const addButton = screen.getByRole('button', { name: 'Add' });
      expect(addButton).toBeDisabled();
    });

    it('should show error for duplicate tag', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={['travel']}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      await user.type(input, 'travel{Enter}');

      expect(screen.getByText('This tag is already added')).toBeInTheDocument();
    });

    it('should show error when max tags reached', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={['tag1', 'tag2', 'tag3']}
          onTagsChange={mockOnTagsChange}
          maxTags={3}
        />
      );

      const input = screen.getByPlaceholderText(/Maximum 3 tags reached/);
      expect(input).toBeDisabled();
      expect(screen.getByText(/You've reached the maximum number of tags \(3\)/)).toBeInTheDocument();
    });

    it('should show validation error for invalid tag', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      await user.type(input, 'a{Enter}'); 

      expect(screen.getByText('Tag must be at least 2 characters')).toBeInTheDocument();
    });

    it('should display external error prop', () => {
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
          error="Custom error message"
        />
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should clear error after successful tag addition', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={['travel']}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');

      await user.type(input, 'travel{Enter}');
      expect(screen.getByText('This tag is already added')).toBeInTheDocument();

      await user.clear(input);
      await user.type(input, 'music{Enter}');
      expect(screen.queryByText('This tag is already added')).not.toBeInTheDocument();
    });
  });

  describe('Max and Min Tags', () => {
    it('should enforce custom max tags limit', () => {
      render(
        <TagSelector
          selectedTags={['tag1', 'tag2', 'tag3', 'tag4', 'tag5']}
          onTagsChange={mockOnTagsChange}
          maxTags={5}
        />
      );

      expect(screen.getByText(/5\/5 tags/)).toBeInTheDocument();
    });

    it('should show minimum tags requirement', () => {
      render(
        <TagSelector
          selectedTags={['travel']}
          onTagsChange={mockOnTagsChange}
          minTags={3}
        />
      );

      expect(screen.getByText(/minimum 3 required/)).toBeInTheDocument();
    });

    it('should not show minimum requirement when met', () => {
      render(
        <TagSelector
          selectedTags={['travel', 'music', 'sports']}
          onTagsChange={mockOnTagsChange}
          minTags={3}
        />
      );

      expect(screen.queryByText(/minimum 3 required/)).not.toBeInTheDocument();
    });

    it('should disable input when max tags reached', () => {
      render(
        <TagSelector
          selectedTags={['tag1', 'tag2']}
          onTagsChange={mockOnTagsChange}
          maxTags={2}
        />
      );

      const input = screen.getByPlaceholderText(/Maximum 2 tags reached/);
      expect(input).toBeDisabled();
    });

    it('should disable add button when max tags reached', () => {
      render(
        <TagSelector
          selectedTags={['tag1', 'tag2']}
          onTagsChange={mockOnTagsChange}
          maxTags={2}
        />
      );

      const addButton = screen.getByRole('button', { name: 'Add' });
      expect(addButton).toBeDisabled();
    });
  });

  describe('Suggestions', () => {
    it('should show suggestions when typing', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      await user.type(input, 'co');

      await waitFor(() => {
        expect(screen.getByText('#coding')).toBeInTheDocument();
        expect(screen.getByText('#coffee')).toBeInTheDocument();
        expect(screen.getByText('#cooking')).toBeInTheDocument();
      });
    });

    it('should add tag when clicking suggestion', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      await user.type(input, 'co');

      await waitFor(async () => {
        const suggestion = screen.getByText('#coding');
        await user.click(suggestion);
      });

      expect(mockOnTagsChange).toHaveBeenCalledWith(['coding']);
    });

    it('should hide suggestions on blur', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      await user.type(input, 'co');

      await waitFor(() => {
        expect(screen.getByText('#coding')).toBeInTheDocument();
      });

      await user.click(document.body);

      await waitFor(() => {
        expect(screen.queryByText('#coding')).not.toBeInTheDocument();
      }, { timeout: 300 });
    });
  });

  describe('Popular Tags', () => {
    it('should show popular tags by default', () => {
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      expect(screen.getByText('Popular Tags - Click to Add')).toBeInTheDocument();
    });

    it('should not show popular tags when showPopular is false', () => {
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
          showPopular={false}
        />
      );

      expect(screen.queryByText('Popular Tags - Click to Add')).not.toBeInTheDocument();
    });

    it('should add popular tag when clicked', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const popularTag = screen.getByRole('button', { name: '#travel' });
      await user.click(popularTag);

      expect(mockOnTagsChange).toHaveBeenCalledWith(['travel']);
    });

    it('should hide popular tags when max reached', () => {
      render(
        <TagSelector
          selectedTags={['tag1', 'tag2']}
          onTagsChange={mockOnTagsChange}
          maxTags={2}
        />
      );

      expect(screen.queryByText('Popular Tags - Click to Add')).not.toBeInTheDocument();
    });
  });

  describe('UI States', () => {
    it('should disable add button when input is empty', () => {
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const addButton = screen.getByRole('button', { name: 'Add' });
      expect(addButton).toBeDisabled();
    });

    it('should enable add button when input has text', async () => {
      const user = userEvent.setup();
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      const addButton = screen.getByRole('button', { name: 'Add' });

      await user.type(input, 'travel');
      expect(addButton).not.toBeDisabled();
    });

    it('should show selected tags container only when tags exist', () => {
      const { rerender } = render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      expect(screen.queryByText(/tags selected/)).not.toBeInTheDocument();

      rerender(
        <TagSelector
          selectedTags={['travel']}
          onTagsChange={mockOnTagsChange}
        />
      );

      expect(screen.getByText('1 tag selected')).toBeInTheDocument();
    });

    it('should show color-coded tag counter', () => {
      const { rerender } = render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
          minTags={2}
        />
      );

      let counter = screen.getByText(/0\/10 tags/);
      expect(counter).toHaveClass('text-gray-500');

      rerender(
        <TagSelector
          selectedTags={['tag1', 'tag2']}
          onTagsChange={mockOnTagsChange}
          minTags={2}
        />
      );
      counter = screen.getByText(/2\/10 tags/);
      expect(counter).toHaveClass('text-green-600');

      rerender(
        <TagSelector
          selectedTags={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
          onTagsChange={mockOnTagsChange}
          maxTags={10}
        />
      );
      counter = screen.getByText(/10\/10 tags/);
      expect(counter).toHaveClass('text-red-600');
    });
  });

  describe('Accessibility', () => {
    it('should have proper button labels', () => {
      render(
        <TagSelector
          selectedTags={['travel']}
          onTagsChange={mockOnTagsChange}
        />
      );

      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
      expect(screen.getByTitle('Remove tag')).toBeInTheDocument();
    });

    it('should have accessible input', () => {
      render(
        <TagSelector
          selectedTags={[]}
          onTagsChange={mockOnTagsChange}
        />
      );

      const input = screen.getByPlaceholderText('Add interest...');
      expect(input).toHaveAttribute('type', 'text');
    });
  });
});
