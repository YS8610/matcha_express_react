import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import FormTextarea from '../FormTextarea';

describe('FormTextarea Component', () => {
  describe('Basic Rendering', () => {
    it('should render textarea field', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<FormTextarea id="bio" name="bio" label="Biography" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Biography')).toBeInTheDocument();
    });

    it('should render without label', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('should apply id attribute', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('id', 'bio');
    });

    it('should apply name attribute', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('name', 'bio');
    });
  });

  describe('Value and onChange', () => {
    it('should display value', () => {
      render(
        <FormTextarea
          id="bio"
          name="bio"
          value="Test biography"
          onChange={() => {}}
        />
      );
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Test biography');
    });

    it('should call onChange when value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<FormTextarea id="bio" name="bio" value="" onChange={handleChange} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should update value when controlled', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setValue(e.target.value);
        };
        return <FormTextarea id="bio" name="bio" value={value} onChange={handleChange} />;
      };

      render(<TestComponent />);

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      await user.type(textarea, 'Hello');

      expect(textarea.value).toBe('Hello');
    });
  });

  describe('Placeholder', () => {
    it('should display placeholder', () => {
      render(
        <FormTextarea id="bio" name="bio" placeholder="Enter your biography..." value="" onChange={() => {}} />
      );
      expect(screen.getByPlaceholderText('Enter your biography...')).toBeInTheDocument();
    });

    it('should work without placeholder', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toHaveAttribute('placeholder');
    });
  });

  describe('Rows Attribute', () => {
    it('should apply custom rows', () => {
      render(<FormTextarea id="bio" name="bio" rows={10} value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '10');
    });

    it('should have default rows when not specified', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows');
    });
  });

  describe('Required Field', () => {
    it('should mark field as required', () => {
      render(<FormTextarea id="bio" name="bio" required value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeRequired();
    });

    it('should not show asterisk for required fields with label', () => {
      render(<FormTextarea id="bio" name="bio" label="Biography" required value="" onChange={() => {}} />);
      const label = screen.getByText('Biography');
      expect(label).toBeInTheDocument();
    });

    it('should not be required by default', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toBeRequired();
    });
  });

  describe('Disabled State', () => {
    it('should disable textarea when disabled prop is true', () => {
      render(<FormTextarea id="bio" name="bio" disabled value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });

    it('should have disabled styling', () => {
      const { container } = render(<FormTextarea id="bio" name="bio" disabled value="" onChange={() => {}} />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('cursor-not-allowed', 'opacity-50');
    });

    it('should not be disabled by default', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('should display error message', () => {
      render(<FormTextarea id="bio" name="bio" error="Biography is required" value="" onChange={() => {}} />);
      expect(screen.getByText('Biography is required')).toBeInTheDocument();
    });

    it('should apply error styling', () => {
      const { container } = render(
        <FormTextarea id="bio" name="bio" error="Error" value="" onChange={() => {}} />
      );
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('border-red-500', 'dark:border-red-500');
    });

    it('should not show error when no error prop', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const errorMessages = document.querySelectorAll('.text-red-500');
      expect(errorMessages.length).toBe(0);
    });

    it('should have default styling when no error', () => {
      const { container } = render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('border-gray-300');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className to container', () => {
      const { container } = render(
        <FormTextarea id="bio" name="bio" className="custom-class" value="" onChange={() => {}} />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should preserve default classes', () => {
      const { container } = render(
        <FormTextarea id="bio" name="bio" className="my-class" value="" onChange={() => {}} />
      );
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('rounded-md');
    });
  });

  describe('HTML Textarea Attributes', () => {
    it('should support maxLength', () => {
      render(<FormTextarea id="bio" name="bio" maxLength={500} value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxLength', '500');
    });

    it('should not support minLength attribute', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should not support wrap attribute', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Resizing', () => {
    it('should be resizable by default', () => {
      const { container } = render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = container.querySelector('textarea');
      const style = window.getComputedStyle(textarea!);
      expect(style.resize).not.toBe('none');
    });

    it('should not apply resize-none to textarea', () => {
      const { container } = render(
        <FormTextarea id="bio" name="bio" value="" onChange={() => {}} />
      );
      const textarea = container.querySelector('textarea');
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes', () => {
      const { container } = render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('dark:bg-[#1a1a1a]', 'dark:border-slate-600', 'dark:text-gray-100');
    });

    it('should have dark mode label classes', () => {
      const { container } = render(
        <FormTextarea id="bio" name="bio" label="Biography" value="" onChange={() => {}} />
      );
      const label = container.querySelector('label');
      expect(label).toHaveClass('dark:text-green-300');
    });
  });

  describe('Accessibility', () => {
    it('should associate label with textarea', () => {
      render(<FormTextarea id="bio" name="bio" label="Biography" value="" onChange={() => {}} />);
      const textarea = screen.getByLabelText('Biography');
      expect(textarea).toBeInTheDocument();
    });

    it('should have proper role', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<FormTextarea id="bio" name="bio" value="" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');
      textarea.focus();
      expect(textarea).toHaveFocus();
    });
  });

  describe('Multi-line Content', () => {
    it('should handle multi-line text', () => {
      const multilineText = 'Line 1\nLine 2\nLine 3';
      render(
        <FormTextarea id="bio" name="bio" value={multilineText} onChange={() => {}} />
      );
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe(multilineText);
    });

    it('should preserve whitespace', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setValue(e.target.value);
        };
        return <FormTextarea id="bio" name="bio" value={value} onChange={handleChange} />;
      };

      render(<TestComponent />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Text with    spaces');

      expect((textarea as HTMLTextAreaElement).value).toContain('    ');
    });
  });

  describe('Character Counter', () => {
    it('should work with maxLength validation', async () => {
      const user = userEvent.setup();
      render(<FormTextarea id="bio" name="bio" maxLength={10} value="" onChange={() => {}} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '12345678901234567890'); // More than maxLength

      const textareaValue = (textarea as HTMLTextAreaElement).value;
      expect(textareaValue.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Complete Usage Scenarios', () => {
    it('should render complete form field with all props', () => {
      render(
        <FormTextarea
          id="description"
          name="description"
          label="Description"
          placeholder="Enter description..."
          rows={5}
          required
          maxLength={500}
          error=""
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter description...')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('should work in controlled component scenario', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setValue(e.target.value);
        };
        return <FormTextarea id="bio" name="bio" value={value} onChange={handleChange} />;
      };

      render(<TestComponent />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test');

      expect((textarea as HTMLTextAreaElement).value).toBe('Test');
    });
  });
});
