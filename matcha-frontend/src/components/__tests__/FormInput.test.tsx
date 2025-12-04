import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('FormInput Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  interface FormInputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
  }

  const FormInput = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    required,
  }: FormInputProps) => (
    <div>
      <label>
        {label}
        {required && <span> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );

  it('should render with label and input', () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should display value in input', () => {
    render(
      <FormInput
        label="Username"
        value="testuser"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Username') as HTMLInputElement;
    expect(input.value).toBe('testuser');
  });

  it('should call onChange when input changes', async () => {
    const user = userEvent.setup();
    render(
      <FormInput
        label="Email"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Email');
    await user.type(input, 'test@example.com');

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange.mock.calls.length).toBeGreaterThan(0);
  });

  it('should display error message', () => {
    render(
      <FormInput
        label="Password"
        value=""
        onChange={mockOnChange}
        error="Password is required"
      />
    );

    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('should support different input types', () => {
    render(
      <FormInput
        label="Password"
        type="password"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('should display placeholder text', () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={mockOnChange}
        placeholder="Enter your email"
      />
    );

    const input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input.placeholder).toBe('Enter your email');
  });

  it('should show required indicator', () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={mockOnChange}
        required={true}
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should update value when prop changes', () => {
    const { rerender } = render(
      <FormInput
        label="Email"
        value="old@example.com"
        onChange={mockOnChange}
      />
    );

    let input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input.value).toBe('old@example.com');

    rerender(
      <FormInput
        label="Email"
        value="new@example.com"
        onChange={mockOnChange}
      />
    );

    input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input.value).toBe('new@example.com');
  });
});
