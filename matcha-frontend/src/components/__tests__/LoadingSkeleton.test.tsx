import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import LoadingSkeleton from '../LoadingSkeleton';

describe('LoadingSkeleton Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<LoadingSkeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render default count of skeletons', () => {
      const { container } = render(<LoadingSkeleton />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(6); // default count
    });

    it('should render with default grid type', () => {
      const { container } = render(<LoadingSkeleton />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  describe('Count Prop', () => {
    it('should render specified count of skeletons', () => {
      const { container } = render(<LoadingSkeleton count={3} />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(3);
    });

    it('should render 10 skeletons when count is 10', () => {
      const { container } = render(<LoadingSkeleton count={10} />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(10);
    });

    it('should render 1 skeleton when count is 1', () => {
      const { container } = render(<LoadingSkeleton count={1} />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(1);
    });
  });

  describe('Type: Grid', () => {
    it('should render grid layout', () => {
      const { container } = render(<LoadingSkeleton type="grid" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('grid');
    });

    it('should render grid skeleton cards with image placeholder', () => {
      const { container } = render(<LoadingSkeleton type="grid" count={2} />);
      const imagePlaceholders = container.querySelectorAll('.h-48');
      expect(imagePlaceholders.length).toBe(2);
    });

    it('should render grid skeleton with content placeholders', () => {
      const { container } = render(<LoadingSkeleton type="grid" count={1} />);
      const contentPlaceholders = container.querySelectorAll('.p-4 .h-4, .p-4 .h-3');
      expect(contentPlaceholders.length).toBeGreaterThan(0);
    });

    it('should have rounded corners on grid cards', () => {
      const { container } = render(<LoadingSkeleton type="grid" count={1} />);
      const card = container.querySelector('.rounded-lg');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Type: List', () => {
    it('should render list layout', () => {
      const { container } = render(<LoadingSkeleton type="list" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('space-y-4');
    });

    it('should render list items with avatar placeholders', () => {
      const { container } = render(<LoadingSkeleton type="list" count={3} />);
      const avatars = container.querySelectorAll('.rounded-full');
      expect(avatars.length).toBe(3);
    });

    it('should render list items with circular avatars', () => {
      const { container } = render(<LoadingSkeleton type="list" count={1} />);
      const avatar = container.querySelector('.w-14.h-14.rounded-full');
      expect(avatar).toBeInTheDocument();
    });

    it('should render list items with text placeholders', () => {
      const { container } = render(<LoadingSkeleton type="list" count={2} />);
      const textPlaceholders = container.querySelectorAll('.space-y-2 .h-4, .space-y-2 .h-3');
      expect(textPlaceholders.length).toBeGreaterThan(0);
    });

    it('should have flex layout for list items', () => {
      const { container } = render(<LoadingSkeleton type="list" count={1} />);
      const item = container.querySelector('.flex.items-center');
      expect(item).toBeInTheDocument();
    });
  });

  describe('Type: Card', () => {
    it('should render card layout', () => {
      const { container } = render(<LoadingSkeleton type="card" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('grid', 'grid-cols-1');
    });

    it('should render card skeleton with single column', () => {
      const { container } = render(<LoadingSkeleton type="card" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('grid-cols-1');
      expect(wrapper).not.toHaveClass('md:grid-cols-2');
    });

    it('should render card skeleton with image placeholder', () => {
      const { container } = render(<LoadingSkeleton type="card" count={1} />);
      const imagePlaceholder = container.querySelector('.h-48');
      expect(imagePlaceholder).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<LoadingSkeleton className="custom-class" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should preserve default classes with custom className', () => {
      const { container } = render(<LoadingSkeleton type="grid" className="my-custom" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('grid', 'my-custom');
    });

    it('should work without custom className', () => {
      const { container } = render(<LoadingSkeleton />);
      const wrapper = container.firstChild;
      expect(wrapper).not.toHaveClass('undefined');
    });
  });

  describe('Animation', () => {
    it('should have animate-pulse on all skeleton items', () => {
      const { container } = render(<LoadingSkeleton count={3} />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(3);
    });

    it('should have animate-pulse on grid type', () => {
      const { container } = render(<LoadingSkeleton type="grid" count={2} />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(2);
    });

    it('should have animate-pulse on list type', () => {
      const { container } = render(<LoadingSkeleton type="list" count={2} />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(2);
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes on grid type', () => {
      const { container } = render(<LoadingSkeleton type="grid" count={1} />);
      const darkElements = container.querySelectorAll('.dark\\:bg-gray-800, .dark\\:bg-gray-700');
      expect(darkElements.length).toBeGreaterThan(0);
    });

    it('should have dark mode classes on list type', () => {
      const { container } = render(<LoadingSkeleton type="list" count={1} />);
      const darkElements = container.querySelectorAll('.dark\\:bg-gray-700, .dark\\:bg-gray-800');
      expect(darkElements.length).toBeGreaterThan(0);
    });
  });

  describe('Complete Usage Scenarios', () => {
    it('should render grid with 6 items for profile browsing', () => {
      const { container } = render(<LoadingSkeleton count={6} type="grid" />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(6);
      expect(container.firstChild).toHaveClass('grid');
    });

    it('should render list with 5 items for messages', () => {
      const { container } = render(<LoadingSkeleton count={5} type="list" />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(5);
      expect(container.firstChild).toHaveClass('space-y-4');
    });

    it('should handle edge case with 0 count', () => {
      const { container } = render(<LoadingSkeleton count={0} />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid classes for grid type', () => {
      const { container } = render(<LoadingSkeleton type="grid" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('should have single column for card type', () => {
      const { container } = render(<LoadingSkeleton type="card" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('grid-cols-1');
      expect(wrapper).toHaveClass('gap-4');
    });

    it('should have gap spacing', () => {
      const { container } = render(<LoadingSkeleton type="grid" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('gap-6');
    });
  });
});
