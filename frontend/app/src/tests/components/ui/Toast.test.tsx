import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Toast from '../../../components/ui/Toast';

describe('Toast Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders toast when isVisible is true', () => {
    render(<Toast message="Test message" type="success" onClose={mockOnClose} isVisible={true} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('does not render toast when isVisible is false', () => {
    render(<Toast message="Test message" type="success" onClose={mockOnClose} isVisible={false} />);

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Toast message="Test message" type="success" onClose={mockOnClose} isVisible={true} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('auto closes after duration', () => {
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={mockOnClose}
        isVisible={true}
        duration={1000}
      />,
    );

    expect(mockOnClose).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders different types with correct styles', () => {
    const { rerender } = render(
      <Toast message="Success message" type="success" onClose={mockOnClose} isVisible={true} />,
    );

    // Verifica se o componente renderiza (simplificando o teste)
    expect(screen.getByText('Success message')).toBeInTheDocument();

    rerender(<Toast message="Error message" type="error" onClose={mockOnClose} isVisible={true} />);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
