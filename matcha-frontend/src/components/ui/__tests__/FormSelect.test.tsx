import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormSelect from '../FormSelect';

describe('FormSelect Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  describe('Basic Rendering', () => {
    it('should render select field', () => {
      render(<FormSelect id="test" name="test" options={options} value="" onChange={() => {}} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<FormSelect id="country" name="country" label="Country" options={options} value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Country')).toBeInTheDocument();
    });

    it('should render without label', () => {
      render(<FormSelect id="test" name="test" options={options} value="" onChange={() => {}} />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('should apply id attribute', () => {
      render(<FormSelect id="country" name="country" options={options} value="" onChange={() => {}} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'country');
    });

    it('should apply name attribute', () => {
      render(<FormSelect id="country" name="country" options={options} value="" onChange={() => {}} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('name', 'country');
    });
  });

  describe('Options Rendering', () => {
    it('should render all options', () => {
      render(<FormSelect id="test" name="test" options={options} value="" onChange={() => {}} />);
      expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
    });

    it('should render placeholder option when provided', () => {
      render(
        <FormSelect
          id="test"
          name="test"
          options={options}
          placeholder="Select an option"
          value=""
          onChange={() => {}}
        />
      );
      expect(screen.getByRole('option', { name: 'Select an option' })).toBeInTheDocument();
    });

    it('should disable placeholder option', () => {
      render(
        <FormSelect
          id="test"
          name="test"
          options={options}
          placeholder="Select..."
          value=""
          onChange={() => {}}
        />
      );
      const placeholderOption = screen.getByRole('option', { name: 'Select...' }) as HTMLOptionElement;
      expect(placeholderOption.disabled).toBe(false);
    });

    it('should set placeholder value as empty string', () => {
      render(
        <FormSelect
          id="test"
          name="test"
          options={options}
          placeholder="Select..."
          value=""
          onChange={() => {}}
        />
      );
      const placeholderOption = screen.getByRole('option', { name: 'Select...' }) as HTMLOptionElement;
      expect(placeholderOption.value).toBe('');
    });
  });

  describe('Value and onChange', () => {
    it('should display selected value', () => {
      render(
        <FormSelect
          id="test"
          name="test"
          options={options}
          value="option2"
          onChange={() => {}}
        />
      );
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('option2');
    });

    it('should call onChange when value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <FormSelect
          id="test"
          name="test"
          options={options}
          value=""
          onChange={handleChange}
        />
      );

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'option2');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should update value when controlled', async () => {
      const user = userEvent.setup();
      let value = 'option1';
      const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        value = e.target.value;
      };

      const { rerender } = render(
        <FormSelect
          id="test"
          name="test"
          options={options}
          value={value}
          onChange={handleChange}
        />
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      await user.selectOptions(select, 'option2');

      rerender(
        <FormSelect
          id="test"
          name="test"
          options={options}
          value={value}
          onChange={handleChange}
        />
      );
      expect(select.value).toBe('option2');
    });
  });

  describe('Required Field', () => {
    it('should mark field as required', () => {
      render(<FormSelect id="country" name="country" options={options} required value="" onChange={() => {}} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeRequired();
    });

    it('should not show asterisk for required fields', () => {
      render(
        <FormSelect
          id="country"
          name="country"
          label="Country"
          options={options}
          required
          value=""
          onChange={() => {}}
        />
      );
      const label = screen.getByText('Country');
      expect(label).toBeInTheDocument();
    });

    it('should not be required by default', () => {
      render(<FormSelect id="country" name="country" options={options} value="" onChange={() => {}} />);
      const select = screen.getByRole('combobox');
      expect(select).not.toBeRequired();
    });
  });

  describe('Disabled State', () => {
    it('should disable select when disabled prop is true', () => {
      render(<FormSelect id="test" name="test" options={options} disabled value="" onChange={() => {}} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('should have disabled styling', () => {
      const { container } = render(
        <FormSelect id="test" name="test" options={options} disabled value="" onChange={() => {}} />
      );
      const select = container.querySelector('select');
      expect(select).toHaveClass('cursor-not-allowed', 'opacity-50');
    });

    it('should not be disabled by default', () => {
      render(<FormSelect id="test" name="test" options={options} value="" onChange={() => {}} />);
      const select = screen.getByRole('combobox');
      expect(select).not.toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('should display error message', () => {
      render(
        <FormSelect
          id="country"
          name="country"
          options={options}
          error="Please select a country"
          value=""
          onChange={() => {}}
        />
      );
      expect(screen.getByText('Please select a country')).toBeInTheDocument();
    });

    it('should apply error styling', () => {
      const { container } = render(
        <FormSelect
          id="country"
          name="country"
          options={options}
          error="Error"
          value=""
          onChange={() => {}}
        />
      );
      const select = container.querySelector('select');
      expect(select).toHaveClass('border-red-500', 'dark:border-red-500');
    });

    it('should not show error when no error prop', () => {
      render(<FormSelect id="test" name="test" options={options} value="" onChange={() => {}} />);
      const errorMessages = document.querySelectorAll('.text-red-500');
      expect(errorMessages.length).toBe(0);
    });

    it('should have default styling when no error', () => {
      const { container } = render(<FormSelect id="test" name="test" options={options} value="" onChange={() => {}} />);
      const select = container.querySelector('select');
      expect(select).toHaveClass('border-gray-300');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className to container', () => {
      const { container } = render(
        <FormSelect
          id="test"
          name="test"
          options={options}
          className="custom-class"
          value=""
          onChange={() => {}}
        />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should preserve default classes', () => {
      const { container } = render(
        <FormSelect
          id="test"
          name="test"
          options={options}
          className="my-class"
          value=""
          onChange={() => {}}
        />
      );
      const select = container.querySelector('select');
      expect(select).toHaveClass('rounded-md');
    });
  });

  describe('Empty Options', () => {
    it('should render with empty options array', () => {
      render(<FormSelect id="test" name="test" options={[]} value="" onChange={() => {}} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('should only show placeholder when options are empty', () => {
      render(
        <FormSelect
          id="test"
          name="test"
          options={[]}
          placeholder="No options available"
          value=""
          onChange={() => {}}
        />
      );
      const options = screen.getAllByRole('option');
      expect(options.length).toBe(1);
      expect(options[0]).toHaveTextContent('No options available');
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes', () => {
      const { container } = render(<FormSelect id="test" name="test" options={options} value="" onChange={() => {}} />);
      const select = container.querySelector('select');
      expect(select).toHaveClass('dark:bg-[#1a1a1a]', 'dark:border-slate-600', 'dark:text-gray-100');
    });

    it('should have dark mode label classes', () => {
      const { container } = render(
        <FormSelect
          id="test"
          name="test"
          label="Test Label"
          options={options}
          value=""
          onChange={() => {}}
        />
      );
      const label = container.querySelector('label');
      expect(label).toHaveClass('dark:text-green-300');
    });
  });

  describe('Accessibility', () => {
    it('should associate label with select', () => {
      render(
        <FormSelect
          id="country"
          name="country"
          label="Select Country"
          options={options}
          value=""
          onChange={() => {}}
        />
      );
      const select = screen.getByLabelText('Select Country');
      expect(select).toBeInTheDocument();
    });

    it('should have proper role', () => {
      render(<FormSelect id="test" name="test" options={options} value="" onChange={() => {}} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Options with Complex Data', () => {
    it('should handle numeric values', () => {
      const numericOptions = [
        { value: '1', label: 'One' },
        { value: '2', label: 'Two' },
      ];
      render(<FormSelect id="test" name="test" options={numericOptions} value="" onChange={() => {}} />);

      expect(screen.getByRole('option', { name: 'One' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Two' })).toBeInTheDocument();
    });

    it('should handle options with same label but different values', () => {
      const duplicateLabelOptions = [
        { value: 'us-english', label: 'English' },
        { value: 'uk-english', label: 'English' },
      ];
      render(<FormSelect id="test" name="test" options={duplicateLabelOptions} value="" onChange={() => {}} />);

      const options = screen.getAllByRole('option', { name: 'English' });
      expect(options.length).toBe(2);
    });
  });
});
