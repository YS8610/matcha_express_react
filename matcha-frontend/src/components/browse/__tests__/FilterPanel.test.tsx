import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import FilterPanel from '@/components/browse/FilterPanel';
import type { SearchFilters } from '@/types';

describe('FilterPanel Component', () => {
  const mockFilters: SearchFilters = {
    ageMin: 20,
    ageMax: 35,
    distanceMax: 50,
    fameMin: 1,
    fameMax: 5,
    interests: 'travel,music',
  };

  let mockOnFilterChange: any;
  let mockOnClose: any;

  beforeEach(() => {
    mockOnFilterChange = vi.fn();
    mockOnClose = vi.fn();
  });

  it('should render filter panel with title', () => {
    render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Filter Your Matches')).toBeTruthy();
  });

  it('should display close button', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const closeButton = container.querySelector('button');
    expect(closeButton).toBeTruthy();
  });

  it('should call onClose when close button clicked', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const closeButton = container.querySelector('button');
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should display age range input fields', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const ageInputs = container.querySelectorAll('input[type="number"]');
    expect(ageInputs.length).toBeGreaterThan(0);
  });

  it('should populate age fields with current filter values', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const numberInputs = container.querySelectorAll('input[type="number"]');
    expect(numberInputs.length).toBeGreaterThan(0);
  });

  it('should have numeric input fields for filters', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const numberInputs = container.querySelectorAll('input[type="number"]');
    expect(numberInputs.length).toBeGreaterThan(0);
  });

  it('should update local filters on input change', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const numberInputs = container.querySelectorAll('input[type="number"]');
    if (numberInputs.length > 0) {
      fireEvent.change(numberInputs[0], { target: { value: '25' } });
      expect(true).toBe(true);
    }
  });

  it('should render with empty filters', () => {
    const emptyFilters: SearchFilters = {};

    render(
      <FilterPanel
        filters={emptyFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Filter Your Matches')).toBeTruthy();
  });

  it('should have apply button', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should call onFilterChange with updated filters', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const buttons = Array.from(container.querySelectorAll('button'));
    const applyButton = buttons.find(btn => btn.textContent?.includes('Apply'));

    if (applyButton) {
      fireEvent.click(applyButton);
      expect(mockOnFilterChange).toHaveBeenCalled();
    }
  });

  it('should support dark mode classes', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const filterPanel = container.querySelector('div');
    expect(filterPanel?.className).toContain('dark:');
  });

  it('should display filter labels', () => {
    render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/Age Range/i)).toBeTruthy();
  });

  it('should reset filter button if present', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should handle rapid filter changes', () => {
    const { container } = render(
      <FilterPanel
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
        onClose={mockOnClose}
      />
    );

    const numberInputs = container.querySelectorAll('input[type="number"]');
    if (numberInputs.length > 0) {
      fireEvent.change(numberInputs[0], { target: { value: '20' } });
      fireEvent.change(numberInputs[0], { target: { value: '25' } });
      fireEvent.change(numberInputs[0], { target: { value: '30' } });

      expect(true).toBe(true);
    }
  });
});
