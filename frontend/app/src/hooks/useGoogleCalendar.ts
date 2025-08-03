import { useState, useEffect, useCallback } from 'react';
import { googleCalendarService, CalendarEvent } from '../services/googleCalendar';

interface UseGoogleCalendarReturn {
  isAuthenticated: boolean;
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  authenticate: () => void;
  createEvent: (event: CalendarEvent) => Promise<void>;
  loadEvents: () => Promise<void>;
  updateEvent: (eventId: string, event: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  checkAvailability: (emails: string[], timeMin: string, timeMax: string) => Promise<unknown>;
}

export const useGoogleCalendar = (): UseGoogleCalendarReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se já está autenticado
  useEffect(() => {
    const token = localStorage.getItem('google_access_token');
    if (token) {
      googleCalendarService.setAccessToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  // Autenticar com Google
  const authenticate = useCallback(() => {
    try {
      const authUrl = googleCalendarService.getAuthUrl();
      window.open(authUrl, '_blank', 'width=500,height=600');

      // Listener para capturar o token de retorno
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          const { token } = event.data;
          localStorage.setItem('google_access_token', token);
          googleCalendarService.setAccessToken(token);
          setIsAuthenticated(true);
          setError(null);
          window.removeEventListener('message', handleMessage);
        }

        if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          setError('Erro na autenticação com Google');
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (err) {
      setError('Erro ao iniciar autenticação');
      console.error(err);
    }
  }, []);

  // Carregar eventos
  const loadEvents = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const calendarEvents = await googleCalendarService.listEvents();
      setEvents(
        calendarEvents.map((event: any) => ({
          ...event,
          id: event.id === null ? undefined : event.id, // convert null to undefined
        })) as CalendarEvent[],
      );
    } catch (err) {
      setError('Erro ao carregar eventos do calendário');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Criar evento
  const createEvent = useCallback(
    async (event: CalendarEvent) => {
      if (!isAuthenticated) {
        setError('Usuário não autenticado');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await googleCalendarService.createEvent(event);
        await loadEvents(); // Recarregar eventos
      } catch (err) {
        setError('Erro ao criar evento');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, loadEvents],
  );

  // Atualizar evento
  const updateEvent = useCallback(
    async (eventId: string, event: Partial<CalendarEvent>) => {
      if (!isAuthenticated) {
        setError('Usuário não autenticado');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await googleCalendarService.updateEvent(eventId, event);
        await loadEvents(); // Recarregar eventos
      } catch (err) {
        setError('Erro ao atualizar evento');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, loadEvents],
  );

  // Deletar evento
  const deleteEvent = useCallback(
    async (eventId: string) => {
      if (!isAuthenticated) {
        setError('Usuário não autenticado');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await googleCalendarService.deleteEvent(eventId);
        await loadEvents(); // Recarregar eventos
      } catch (err) {
        setError('Erro ao deletar evento');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, loadEvents],
  );

  // Verificar disponibilidade
  const checkAvailability = useCallback(
    async (emails: string[], timeMin: string, timeMax: string) => {
      if (!isAuthenticated) {
        setError('Usuário não autenticado');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const availability = await googleCalendarService.checkAvailability(
          emails,
          timeMin,
          timeMax,
        );
        return availability;
      } catch (err) {
        setError('Erro ao verificar disponibilidade');
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated],
  );

  return {
    isAuthenticated,
    events,
    loading,
    error,
    authenticate,
    createEvent,
    loadEvents,
    updateEvent,
    deleteEvent,
    checkAvailability,
  };
};
