import { CalendlyService } from '../../services/calendlyService';

// Mock do fetch
global.fetch = jest.fn();

describe('CalendlyService', () => {
  let service: CalendlyService;
  const mockToken = 'test-token-123';

  beforeEach(() => {
    service = new CalendlyService(mockToken);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    it('deve inicializar com token correto', () => {
      expect(service).toBeInstanceOf(CalendlyService);
    });
  });

  describe('getCurrentUser', () => {
    it('deve retornar dados do usuário atual com sucesso', async () => {
      const mockUserData = {
        resource: {
          uri: 'https://api.calendly.com/users/123',
          name: 'João Silva',
          slug: 'joao-silva',
          email: 'joao@teste.com',
          timezone: 'America/Sao_Paulo',
          scheduling_url: 'https://calendly.com/joao-silva',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData,
      } as Response);

      const result = await service.getCurrentUser();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.calendly.com/users/me',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token-123',
            'Content-Type': 'application/json',
          }),
        }),
      );

      expect(result).toEqual(mockUserData.resource);
    });

    it('deve lançar erro quando API retorna erro', async () => {
      const mockErrorResponse = {
        message: 'Token inválido',
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(service.getCurrentUser()).rejects.toThrow(
        'Calendly API Error: 401 - Token inválido',
      );
    });

    it('deve lançar erro quando não consegue fazer parse do JSON', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as unknown as Response);

      await expect(service.getCurrentUser()).rejects.toThrow(
        'Calendly API Error: 500 - Internal Server Error',
      );
    });
  });

  describe('getEventTypes', () => {
    it('deve retornar lista de tipos de evento', async () => {
      const userUri = 'https://api.calendly.com/users/123';
      const mockEventTypesData = {
        collection: [
          {
            uri: 'https://api.calendly.com/event_types/456',
            name: 'Reunião de 30 minutos',
            slug: 'reuniao-30min',
            scheduling_url: 'https://calendly.com/joao/reuniao-30min',
            duration: 30,
            kind: 'solo',
            type: 'StandardEventType',
            color: '#0069ff',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          },
        ],
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventTypesData,
      } as Response);

      const result = await service.getEventTypes(userUri);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.calendly.com/event_types?user=${encodeURIComponent(userUri)}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token-123',
          }),
        }),
      );

      expect(result).toEqual(mockEventTypesData.collection);
    });
  });

  describe('getScheduledEvents', () => {
    it('deve retornar lista de eventos agendados', async () => {
      const userUri = 'https://api.calendly.com/users/123';
      const mockEventsData = {
        collection: [
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
        ],
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData,
      } as Response);

      const result = await service.getScheduledEvents(userUri);

      expect(result).toEqual(mockEventsData.collection);
    });

    it('deve aplicar filtros nos parâmetros da query', async () => {
      const userUri = 'https://api.calendly.com/users/123';
      const options = {
        minStartTime: '2025-08-01T00:00:00Z',
        maxStartTime: '2025-08-31T23:59:59Z',
        status: 'active' as const,
        sort: 'start_time:asc' as const,
        count: 50,
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ collection: [] }),
      } as Response);

      await service.getScheduledEvents(userUri, options);

      const expectedUrl =
        'https://api.calendly.com/scheduled_events?' +
        new URLSearchParams({
          user: userUri,
          minStartTime: options.minStartTime,
          maxStartTime: options.maxStartTime,
          status: options.status,
          sort: options.sort,
          count: options.count.toString(),
        }).toString();

      expect(fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });
  });

  describe('generateSchedulingLink', () => {
    it('deve gerar link básico sem parâmetros', () => {
      const eventTypeSlug = 'reuniao-30min';
      const userSlug = 'joao-silva';

      const result = service.generateSchedulingLink(eventTypeSlug, userSlug);

      expect(result).toBe('https://calendly.com/joao-silva/reuniao-30min');
    });

    it('deve gerar link com parâmetros de customização', () => {
      const eventTypeSlug = 'reuniao-30min';
      const userSlug = 'joao-silva';
      const options = {
        name: 'Maria Santos',
        email: 'maria@teste.com',
        hide_gdpr_banner: true,
        primary_color: '0069ff',
      };

      const result = service.generateSchedulingLink(eventTypeSlug, userSlug, options);

      expect(result).toContain('https://calendly.com/joao-silva/reuniao-30min?');
      expect(result).toContain('name=Maria+Santos');
      expect(result).toContain('email=maria%40teste.com');
      expect(result).toContain('hide_gdpr_banner=1');
      expect(result).toContain('primary_color=0069ff');
    });

    it('deve retornar link sem query string quando não há opções', () => {
      const eventTypeSlug = 'reuniao-30min';
      const userSlug = 'joao-silva';
      const options = {};

      const result = service.generateSchedulingLink(eventTypeSlug, userSlug, options);

      expect(result).toBe('https://calendly.com/joao-silva/reuniao-30min');
      expect(result).not.toContain('?');
    });
  });

  describe('cancelEvent', () => {
    it('deve cancelar evento com sucesso', async () => {
      const eventUri = 'https://api.calendly.com/scheduled_events/789';
      const reason = 'Motivo do cancelamento';
      const mockCancelData = {
        resource: {
          uri: eventUri,
          name: 'Evento Cancelado',
          status: 'canceled' as const,
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
        },
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCancelData,
      } as Response);

      const result = await service.cancelEvent(eventUri, reason);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.calendly.com/scheduled_events/${encodeURIComponent(eventUri)}/cancellation`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ reason }),
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token-123',
          }),
        }),
      );

      expect(result).toEqual(mockCancelData.resource);
    });
  });
});
