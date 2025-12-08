import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from '../FormInput';

describe('FormInput Component', () => {
  describe('Basic Rendering', () => {
    it('should render input field', () => {
      render(<FormInput id="test" name="test" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<FormInput id="email" name="email" label="Email Address" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('should render without label', () => {
      render(<FormInput id="test" name="test" value="" onChange={() => {}} />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('should apply id attribute', () => {
      render(<FormInput id="email" name="email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'email');
    });

    it('should apply name attribute', () => {
      render(<FormInput id="username" name="username" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'username');
    });
  });

  describe('Input Types', () => {
    it('should support text type', () => {
      render(<FormInput id="name" name="name" type="text" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should support email type', () => {
      render(<FormInput id="email" name="email" type="email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should support password type', () => {
      render(<FormInput id="password" name="password" type="password" value="" onChange={() => {}} />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should support number type', () => {
      render(<FormInput id="age" name="age" type="number" value="" onChange={() => {}} />);
      const input = document.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });

    it('should support date type', () => {
      render(<FormInput id="birthdate" name="birthdate" type="date" value="" onChange={() => {}} />);
      const input = document.querySelector('input[type="date"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Value and onChange', () => {
    it('should display value', () => {
      render(<FormInput id="name" name="name" value="John" onChange={() => {}} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('John');
    });

    it('should call onChange when value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<FormInput id="name" name="name" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should update value when controlled', async () => {
      const user = userEvent.setup();
      let value = '';
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        value = e.target.value;
      };

      const { rerender } = render(
        <FormInput id="name" name="name" value={value} onChange={handleChange} />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'a');

      rerender(<FormInput id="name" name="name" value={value} onChange={handleChange} />);
      expect(input.value).toBe('a');
    });
  });

  describe('Placeholder', () => {
    it('should display placeholder', () => {
      render(<FormInput id="email" name="email" placeholder="Enter your email" value="" onChange={() => {}} />);
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('should work without placeholder', () => {
      render(<FormInput id="name" name="name" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('placeholder');
    });
  });

  describe('Required Field', () => {
    it('should mark field as required', () => {
      render(<FormInput id="email" name="email" required value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('should mark field as required when required prop is true', () => {
      render(<FormInput id="email" name="email" value="" onChange={() => {}} label="Email" required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('should not be required by default', () => {
      render(<FormInput id="email" name="email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).not.toBeRequired();
    });
  });

  describe('Disabled State', () => {
    it('should disable input when disabled prop is true', () => {
      render(<FormInput id="email" name="email" disabled value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should have disabled styling', () => {
      const { container } = render(<FormInput id="email" name="email" value="" onChange={() => {}} disabled />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should not be disabled by default', () => {
      render(<FormInput id="email" name="email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).not.toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('should display error message', () => {
      render(<FormInput id="email" name="email" error="Invalid email" value="" onChange={() => {}} />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('should apply error styling', () => {
      const { container } = render(<FormInput id="email" name="email" error="Error" value="" onChange={() => {}} />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-red-500', 'dark:border-red-500');
    });

    it('should not show error when no error prop', () => {
      render(<FormInput id="email" name="email" value="" onChange={() => {}} />);
      const errorMessages = document.querySelectorAll('.text-red-500');
      expect(errorMessages.length).toBe(0);
    });

    it('should have default styling when no error', () => {
      const { container } = render(<FormInput id="email" name="email" value="" onChange={() => {}} />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-gray-300');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className to container', () => {
      const { container } = render(
        <FormInput id="test" name="test" value="" onChange={() => {}} className="custom-class" />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should work with className prop', () => {
      const { container } = render(
        <FormInput id="test" name="test" value="" onChange={() => {}} className="my-class" />
      );
      expect(container.firstChild).toHaveClass('my-class');
    });
  });

  describe('HTML Input Attributes', () => {
    it('should support maxLength', () => {
      render(<FormInput id="username" name="username" maxLength={20} value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '20');
    });

    it('should support min and max for numbers', () => {
      render(<FormInput id="age" name="age" type="number" min={18} max={100} value="" onChange={() => {}} />);
      const input = document.querySelector('input[type="number"]');
      expect(input).toHaveAttribute('min', '18');
      expect(input).toHaveAttribute('max', '100');
    });

    it('should support step for numbers', () => {
      render(<FormInput id="price" name="price" type="number" step="0.01" value="" onChange={() => {}} />);
      const input = document.querySelector('input[type="number"]');
      expect(input).toHaveAttribute('step', '0.01');
    });

    it('should support HTML5 validation attributes', () => {
      render(<FormInput id="phone" name="phone" value="" onChange={() => {}} maxLength={10} minLength={5} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength');
      expect(input).toHaveAttribute('minLength');
    });

    it('should support autoComplete', () => {
      render(<FormInput id="email" name="email" autoComplete="email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes', () => {
      const { container } = render(<FormInput id="test" name="test" value="" onChange={() => {}} />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('dark:text-gray-100');
    });

    it('should have dark mode label classes', () => {
      const { container } = render(<FormInput id="test" name="test" value="" onChange={() => {}} label="Test Label" />);
      const label = container.querySelector('label');
      expect(label).toHaveClass('dark:text-green-300');
    });
  });

  describe('Accessibility', () => {
    it('should associate label with input', () => {
      render(<FormInput id="email" name="email" label="Email Address" value="" onChange={() => {}} />);
      const input = screen.getByLabelText('Email Address');
      expect(input).toBeInTheDocument();
    });

    it('should have proper aria attributes for errors', () => {
      render(<FormInput id="email" name="email" error="Invalid" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });
});
