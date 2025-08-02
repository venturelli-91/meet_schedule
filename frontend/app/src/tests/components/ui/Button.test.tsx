import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomButton from '../../../components/ui/Button';

interface MockButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

// Mock do flowbite-react para evitar problemas com dependências externas
jest.mock('flowbite-react', () => ({
  Button: ({ children, onClick, className, type, disabled, ...props }: MockButtonProps) => (
    <button
      onClick={onClick}
      className={className}
      type={type}
      disabled={disabled}
      {...props}
      data-testid="flowbite-button"
    >
      {children}
    </button>
  ),
}));

describe('CustomButton', () => {
  it('should render correctly with children', () => {
    render(<CustomButton>Test Button</CustomButton>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });

  it('should render the inner span with correct text', () => {
    render(<CustomButton>Click Me</CustomButton>);

    const span = screen.getByText('Click Me');
    expect(span).toBeInTheDocument();
    expect(span.tagName).toBe('SPAN');
  });

  it('should call onClick function when clicked', () => {
    const mockOnClick = jest.fn();
    render(<CustomButton onClick={mockOnClick}>Clickable Button</CustomButton>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when no function is provided', () => {
    render(<CustomButton>Non-clickable Button</CustomButton>);

    const button = screen.getByRole('button');
    // Não deve gerar erro quando clicado sem onClick
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('should apply correct CSS classes to the button', () => {
    render(<CustomButton>Styled Button</CustomButton>);

    const button = screen.getByTestId('flowbite-button');
    expect(button).toHaveClass('relative', 'inline-flex', 'items-center', 'justify-center');
    expect(button).toHaveClass('bg-gradient-to-br', 'from-cyan-500', 'to-blue-500');
    expect(button).toHaveClass('rounded-lg', 'group');
  });

  it('should apply correct CSS classes to the inner span', () => {
    render(<CustomButton>Span Test</CustomButton>);

    const span = screen.getByText('Span Test');
    expect(span).toHaveClass('relative', 'px-5', 'py-2.5');
    expect(span).toHaveClass('transition-all', 'ease-in', 'duration-75');
    expect(span).toHaveClass('bg-white', 'dark:bg-gray-900', 'rounded-md');
  });

  it('should pass additional props to the underlying Button component', () => {
    render(
      <CustomButton disabled type="submit" aria-label="Submit form">
        Submit
      </CustomButton>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  it('should handle multiple clicks correctly', () => {
    const mockOnClick = jest.fn();
    render(<CustomButton onClick={mockOnClick}>Multi-click Button</CustomButton>);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it('should render with different children types', () => {
    const { rerender } = render(<CustomButton>Text Content</CustomButton>);
    expect(screen.getByText('Text Content')).toBeInTheDocument();

    rerender(
      <CustomButton>
        <span>Nested Content</span>
      </CustomButton>,
    );
    expect(screen.getByText('Nested Content')).toBeInTheDocument();

    rerender(<CustomButton>{123}</CustomButton>);
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should maintain accessibility standards', () => {
    render(<CustomButton>Accessible Button</CustomButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Accessible Button');
  });
});
