import { useState, useEffect, useCallback } from 'react';
import {
  CalendlyService,
  CalendlyUser,
  CalendlyEventType,
  CalendlyEvent,
  CalendlyInvitee,
  createCalendlyService,
} from '../services/calendlyService';

interface UseCalendlyReturn {
  isAuthenticated: boolean;
  user: CalendlyUser | null;
  eventTypes: CalendlyEventType[];
  events: CalendlyEvent[];
  loading: boolean;
  error: string | null;
  initializeCalendly: (apiToken?: string) => void;
  initializeCalendlyFromEnv: () => void;
  loadEventTypes: () => Promise<void>;
  loadEvents: (options?: {
    minStartTime?: string;
    maxStartTime?: string;
    status?: 'active' | 'canceled';
  }) => Promise<void>;
  getEventDetails: (eventUri: string) => Promise<CalendlyEvent | null>;
  getEventInvitees: (eventUri: string) => Promise<CalendlyInvitee[]>;
  cancelEvent: (eventUri: string, reason?: string) => Promise<boolean>;
  generateSchedulingLink: (
    eventTypeSlug: string,
    options?: {
      name?: string;
      email?: string;
      text_reminder_number?: string;
      hide_gdpr_banner?: boolean;
      hide_landing_page_details?: boolean;
      hide_event_type_details?: boolean;
      background_color?: string;
      text_color?: string;
      primary_color?: string;
    },
  ) => string | null;
}

export const useCalendly = (): UseCalendlyReturn => {
  const [service, setService] = useState<CalendlyService | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<CalendlyUser | null>(null);
  const [eventTypes, setEventTypes] = useState<CalendlyEventType[]>([]);
  const [events, setEvents] = useState<CalendlyEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeCalendly = useCallback(async (apiToken?: string) => {
    setLoading(true);
    setError(null);

    try {
      let calendlyService: CalendlyService;

      if (apiToken) {
        if (apiToken.trim() === '') {
          setError('Token da API do Calendly é obrigatório');
          return;
        }
        calendlyService = new CalendlyService(apiToken);
      } else {
        // Usar o token das variáveis de ambiente
        calendlyService = createCalendlyService();
      }

      const currentUser = await calendlyService.getCurrentUser();

      setService(calendlyService);
      setUser(currentUser);
      setIsAuthenticated(true);

      console.log('✅ Calendly conectado com sucesso!', {
        nome: currentUser.name,
        email: currentUser.email,
        slug: currentUser.slug,
      });
    } catch (err) {
      console.error('❌ Erro ao conectar com Calendly:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao conectar com Calendly');
      setIsAuthenticated(false);
      setUser(null);
      setService(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeCalendlyFromEnv = useCallback(() => {
    initializeCalendly(); // Chama sem token para usar as variáveis de ambiente
  }, [initializeCalendly]);

  const loadEventTypes = useCallback(async () => {
    if (!service || !user) {
      setError('Serviço Calendly não inicializado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const types = await service.getEventTypes(user.uri);
      setEventTypes(types);

      console.log(`✅ ${types.length} tipos de evento carregados`);
    } catch (err) {
      console.error('❌ Erro ao carregar tipos de evento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de evento');
    } finally {
      setLoading(false);
    }
  }, [service, user]);

  const loadEvents = useCallback(
    async (
      options: {
        minStartTime?: string;
        maxStartTime?: string;
        status?: 'active' | 'canceled';
      } = {},
    ) => {
      if (!service || !user) {
        setError('Serviço Calendly não inicializado');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const eventList = await service.getScheduledEvents(user.uri, {
          ...options,
          sort: 'start_time:asc',
          count: 100,
        });

        setEvents(eventList);

        console.log(`✅ ${eventList.length} eventos carregados`);
      } catch (err) {
        console.error('❌ Erro ao carregar eventos:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar eventos');
      } finally {
        setLoading(false);
      }
    },
    [service, user],
  );

  const getEventDetails = useCallback(
    async (eventUri: string): Promise<CalendlyEvent | null> => {
      if (!service) {
        setError('Serviço Calendly não inicializado');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const event = await service.getEvent(eventUri);
        return event;
      } catch (err) {
        console.error('❌ Erro ao obter detalhes do evento:', err);
        setError(err instanceof Error ? err.message : 'Erro ao obter detalhes do evento');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [service],
  );

  const getEventInvitees = useCallback(
    async (eventUri: string): Promise<CalendlyInvitee[]> => {
      if (!service) {
        setError('Serviço Calendly não inicializado');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const invitees = await service.getEventInvitees(eventUri);
        return invitees;
      } catch (err) {
        console.error('❌ Erro ao obter participantes:', err);
        setError(err instanceof Error ? err.message : 'Erro ao obter participantes');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [service],
  );

  const cancelEvent = useCallback(
    async (eventUri: string, reason?: string): Promise<boolean> => {
      if (!service) {
        setError('Serviço Calendly não inicializado');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await service.cancelEvent(eventUri, reason);

        if (user) {
          await loadEvents();
        }

        console.log('✅ Evento cancelado com sucesso');
        return true;
      } catch (err) {
        console.error('❌ Erro ao cancelar evento:', err);
        setError(err instanceof Error ? err.message : 'Erro ao cancelar evento');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [service, user, loadEvents],
  );

  const generateSchedulingLink = useCallback(
    (
      eventTypeSlug: string,
      options: {
        name?: string;
        email?: string;
        text_reminder_number?: string;
        hide_gdpr_banner?: boolean;
        hide_landing_page_details?: boolean;
        hide_event_type_details?: boolean;
        background_color?: string;
        text_color?: string;
        primary_color?: string;
      } = {},
    ): string | null => {
      if (!service || !user) {
        setError('Serviço Calendly não inicializado');
        return null;
      }

      try {
        return service.generateSchedulingLink(eventTypeSlug, user.slug, options);
      } catch (err) {
        console.error('❌ Erro ao gerar link de agendamento:', err);
        setError(err instanceof Error ? err.message : 'Erro ao gerar link de agendamento');
        return null;
      }
    },
    [service, user],
  );

  useEffect(() => {
    if (isAuthenticated && user && service) {
      Promise.all([
        loadEventTypes(),
        loadEvents({
          minStartTime: new Date().toISOString(),
          status: 'active',
        }),
      ]).catch(console.error);
    }
  }, [isAuthenticated, user, service, loadEventTypes, loadEvents]);

  return {
    isAuthenticated,
    user,
    eventTypes,
    events,
    loading,
    error,
    initializeCalendly,
    initializeCalendlyFromEnv,
    loadEventTypes,
    loadEvents,
    getEventDetails,
    getEventInvitees,
    cancelEvent,
    generateSchedulingLink,
  };
};
