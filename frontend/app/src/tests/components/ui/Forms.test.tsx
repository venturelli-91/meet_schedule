import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScheduleForm from '../../../components/ui/Forms';

interface MockFloatingLabelProps {
  label: string;
  type: string;
  variant?: string;
  className?: string;
}

jest.mock('flowbite-react', () => ({
  FloatingLabel: ({ label, type, variant, className }: MockFloatingLabelProps) => (
    <div data-testid="floating-label">
      <label>{label}</label>
      <input type={type} className={className} data-variant={variant} placeholder={label} />
    </div>
  ),
}));

describe('ScheduleForm', () => {
  test('renders all form fields', () => {
    render(<ScheduleForm />);

    // Preenchimento dos campos
    expect(screen.getByPlaceholderText('Event Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Time')).toBeInTheDocument();
  });

  test('renders with correct input types', () => {
    render(<ScheduleForm />);

    // Teste de input
    expect(screen.getByPlaceholderText('Event Name')).toHaveAttribute('type', 'text');
    expect(screen.getByPlaceholderText('Date')).toHaveAttribute('type', 'date');
    expect(screen.getByPlaceholderText('Time')).toHaveAttribute('type', 'time');
  });

  test('renders with outlined variant', () => {
    render(<ScheduleForm />);

    const inputs = screen.getAllByRole('textbox', { hidden: true });
    inputs.forEach(input => {
      expect(input).toHaveAttribute('data-variant', 'outlined');
    });
  });
});
