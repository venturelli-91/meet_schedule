import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickActions from '../../../components/ui/QuickActions';

describe('QuickActions Component', () => {
  it('renders with default actions', () => {
    render(<QuickActions />);

    expect(screen.getByText('Ações Rápidas')).toBeInTheDocument();
    expect(screen.getByText('Novo Meeting')).toBeInTheDocument();
    expect(screen.getByText('Agenda Hoje')).toBeInTheDocument();
    expect(screen.getByText('Próximos')).toBeInTheDocument();
    expect(screen.getByText('Participantes')).toBeInTheDocument();
    expect(screen.getByText('Ver Todos')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('renders with custom actions', () => {
    const customActions = [
      {
        id: 'custom-action',
        title: 'Custom Action',
        description: 'Custom description',
        icon: () => <div>Icon</div>,
        onClick: jest.fn(),
        color: 'blue' as const,
      },
    ];

    render(<QuickActions actions={customActions} />);

    expect(screen.getByText('Custom Action')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
    expect(screen.queryByText('Novo Meeting')).not.toBeInTheDocument();
  });

  it('calls onClick when action button is clicked', () => {
    const mockOnClick = jest.fn();
    const customActions = [
      {
        id: 'test-action',
        title: 'Test Action',
        description: 'Test description',
        icon: () => <div>Icon</div>,
        onClick: mockOnClick,
        color: 'blue' as const,
      },
    ];

    render(<QuickActions actions={customActions} />);

    const actionButton = screen.getByText('Test Action').closest('button');
    fireEvent.click(actionButton!);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<QuickActions className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders all default action descriptions', () => {
    render(<QuickActions />);

    expect(screen.getByText('Agendar novo compromisso')).toBeInTheDocument();
    expect(screen.getByText('Ver compromissos de hoje')).toBeInTheDocument();
    expect(screen.getByText('Meetings da semana')).toBeInTheDocument();
    expect(screen.getByText('Gerenciar contatos')).toBeInTheDocument();
    expect(screen.getByText('Todos os meetings')).toBeInTheDocument();
    expect(screen.getByText('Preferências da conta')).toBeInTheDocument();
  });
});
