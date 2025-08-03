import { renderHook, act } from '@testing-library/react';
import { useCalendly } from '../../hooks/useCalendly';
import { CalendlyService } from '../../services/calendlyService';

// Mock do CalendlyService
jest.mock('../../services/calendlyService');

describe('useCalendly', () => {
  const mockCalendlyService = CalendlyService as jest.MockedClass<typeof CalendlyService>;
  let mockServiceInstance: jest.Mocked<CalendlyService>;

  beforeEach(() => {
    mockServiceInstance = {
      getCurrentUser: jest.fn(),
      getEventTypes: jest.fn(),
      getScheduledEvents: jest.fn(),
      getEvent: jest.fn(),
      getEventInvitees: jest.fn(),
      cancelEvent: jest.fn(),
      generateSchedulingLink: jest.fn(),
      getSchedulingUrl: jest.fn(),
    } as unknown as jest.Mocked<CalendlyService>;

    mockCalendlyService.mockImplementation(() => mockServiceInstance);
    jest.clearAllMocks();
  });

  describe('estado inicial', () => {
    it('deve ter estado inicial correto', () => {
      const { result } = renderHook(() => useCalendly());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(result.current.eventTypes).toEqual([]);
      expect(result.current.events).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('initializeCalendly', () => {
    it('deve inicializar com sucesso', async () => {
      const mockUser = {
        uri: 'https://api.calendly.com/users/123',
        name: 'João Silva',
        slug: 'joao-silva',
        email: 'joao@teste.com',
        timezone: 'America/Sao_Paulo',
        scheduling_url: 'https://calendly.com/joao-silva',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const mockEventTypes = [
        {
          uri: 'https://api.calendly.com/event_types/456',
          name: 'Reunião 30min',
          slug: 'reuniao-30min',
          scheduling_url: 'https://calendly.com/joao/reuniao-30min',
          duration: 30,
          kind: 'solo',
          type: 'StandardEventType',
          color: '#0069ff',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];

      const mockEvents = [
        {
          uri: 'https://api.calendly.com/scheduled_events/789',
          name: 'Reunião com Cliente',
          status: 'active' as const,
          start_time: '2025-08-04T10:00:00Z',
          end_time: '2025-08-04T10:30:00Z',
          event_type: 'https://api.calendly.com/event_types/456',
          invitees_counter: {
            total: 1,
            active: 1,
            limit: 1,
          },
          created_at: '2025-08-03T10:00:00Z',
          updated_at: '2025-08-03T10:00:00Z',
        },
      ];

      mockServiceInstance.getCurrentUser.mockResolvedValue(mockUser);
      mockServiceInstance.getEventTypes.mockResolvedValue(mockEventTypes);
      mockServiceInstance.getScheduledEvents.mockResolvedValue(mockEvents);

      const { result } = renderHook(() => useCalendly());

      await act(async () => {
        await result.current.initializeCalendly('test-token');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.eventTypes).toEqual(mockEventTypes);
      expect(result.current.events).toEqual(mockEvents);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('deve tratar erro na inicialização', async () => {
      const errorMessage = 'Token inválido';
      mockServiceInstance.getCurrentUser.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCalendly());

      await act(async () => {
        await result.current.initializeCalendly('token-invalido');
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });

    it('deve validar token vazio', async () => {
      const { result } = renderHook(() => useCalendly());

      await act(async () => {
        await result.current.initializeCalendly('');
      });

      expect(result.current.error).toBe('Token da API do Calendly é obrigatório');
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('loadEvents', () => {
    it('deve carregar eventos com sucesso', async () => {
      const mockUser = {
        uri: 'https://api.calendly.com/users/123',
        name: 'João Silva',
        slug: 'joao-silva',
        email: 'joao@teste.com',
        timezone: 'America/Sao_Paulo',
        scheduling_url: 'https://calendly.com/joao-silva',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const mockEvents = [
        {
          uri: 'https://api.calendly.com/scheduled_events/789',
          name: 'Novo Evento',
          status: 'active' as const,
          start_time: '2025-08-05T14:00:00Z',
          end_time: '2025-08-05T15:00:00Z',
          event_type: 'https://api.calendly.com/event_types/456',
          invitees_counter: {
            total: 1,
            active: 1,
            limit: 1,
          },
          created_at: '2025-08-03T10:00:00Z',
          updated_at: '2025-08-03T10:00:00Z',
        },
      ];

      mockServiceInstance.getCurrentUser.mockResolvedValue(mockUser);
      mockServiceInstance.getEventTypes.mockResolvedValue([]);
      mockServiceInstance.getScheduledEvents.mockResolvedValue(mockEvents);

      const { result } = renderHook(() => useCalendly());

      // Primeiro inicializar
      await act(async () => {
        await result.current.initializeCalendly('test-token');
      });

      // Depois carregar eventos novamente
      await act(async () => {
        await result.current.loadEvents({
          minStartTime: '2025-08-05T00:00:00Z',
          status: 'active',
        });
      });

      expect(result.current.events).toEqual(mockEvents);
      expect(mockServiceInstance.getScheduledEvents).toHaveBeenCalledWith(
        mockUser.uri,
        expect.objectContaining({
          minStartTime: '2025-08-05T00:00:00Z',
          status: 'active',
          sort: 'start_time:asc',
          count: 100,
        }),
      );
    });
  });

  describe('generateSchedulingLink', () => {
    it('deve gerar link de agendamento', async () => {
      const mockUser = {
        uri: 'https://api.calendly.com/users/123',
        name: 'João Silva',
        slug: 'joao-silva',
        email: 'joao@teste.com',
        timezone: 'America/Sao_Paulo',
        scheduling_url: 'https://calendly.com/joao-silva',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const expectedLink = 'https://calendly.com/joao-silva/reuniao-30min?name=Maria';

      mockServiceInstance.getCurrentUser.mockResolvedValue(mockUser);
      mockServiceInstance.getEventTypes.mockResolvedValue([]);
      mockServiceInstance.getScheduledEvents.mockResolvedValue([]);
      mockServiceInstance.generateSchedulingLink.mockReturnValue(expectedLink);

      const { result } = renderHook(() => useCalendly());

      await act(async () => {
        await result.current.initializeCalendly('test-token');
      });

      const link = result.current.generateSchedulingLink('reuniao-30min', {
        name: 'Maria',
      });

      expect(link).toBe(expectedLink);
      expect(mockServiceInstance.generateSchedulingLink).toHaveBeenCalledWith(
        'reuniao-30min',
        'joao-silva',
        { name: 'Maria' },
      );
    });

    it('deve retornar null quando não autenticado', () => {
      const { result } = renderHook(() => useCalendly());

      act(() => {
        const link = result.current.generateSchedulingLink('reuniao-30min');
        expect(link).toBe(null);
      });

      expect(result.current.error).toBe('Serviço Calendly não inicializado');
    });
  });

  describe('cancelEvent', () => {
    it('deve cancelar evento com sucesso', async () => {
      const mockUser = {
        uri: 'https://api.calendly.com/users/123',
        name: 'João Silva',
        slug: 'joao-silva',
        email: 'joao@teste.com',
        timezone: 'America/Sao_Paulo',
        scheduling_url: 'https://calendly.com/joao-silva',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const eventUri = 'https://api.calendly.com/scheduled_events/789';
      const reason = 'Motivo do cancelamento';

      mockServiceInstance.getCurrentUser.mockResolvedValue(mockUser);
      mockServiceInstance.getEventTypes.mockResolvedValue([]);
      mockServiceInstance.getScheduledEvents.mockResolvedValue([]);
      mockServiceInstance.cancelEvent.mockResolvedValue({
        uri: eventUri,
        name: 'Evento Cancelado',
        status: 'canceled',
        start_time: '2025-08-04T10:00:00Z',
        end_time: '2025-08-04T10:30:00Z',
        event_type: 'https://api.calendly.com/event_types/456',
        invitees_counter: {
          total: 1,
          active: 0,
          limit: 1,
        },
        created_at: '2025-08-03T10:00:00Z',
        updated_at: '2025-08-03T10:00:00Z',
      });

      const { result } = renderHook(() => useCalendly());

      await act(async () => {
        await result.current.initializeCalendly('test-token');
      });

      let cancelResult: boolean = false;
      await act(async () => {
        cancelResult = await result.current.cancelEvent(eventUri, reason);
      });

      expect(cancelResult).toBe(true);
      expect(mockServiceInstance.cancelEvent).toHaveBeenCalledWith(eventUri, reason);
    });
  });
});
