import { google, calendar_v3 } from 'googleapis';

// Configurações do Google Calendar API
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export class GoogleCalendarService {
  private auth!: import('google-auth-library').OAuth2Client;
  private calendar!: import('googleapis').calendar_v3.Calendar;

  constructor() {
    // Inicializar a autenticação do Google
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Para desenvolvimento, você precisará configurar as credenciais OAuth2
      this.auth = new google.auth.OAuth2(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      );

      this.calendar = google.calendar({ version: 'v3', auth: this.auth });
    } catch (error) {
      console.error('Erro ao inicializar autenticação do Google:', error);
    }
  }

  // Obter URL de autorização
  getAuthUrl(): string {
    if (!this.auth) {
      throw new Error('Autenticação não inicializada');
    }

    return this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
  }

  // Definir token de acesso
  async setAccessToken(token: string) {
    if (!this.auth) {
      throw new Error('Autenticação não inicializada');
    }

    this.auth.setCredentials({ access_token: token });
  }

  // Criar evento no calendário
  async createEvent(
    event: CalendarEvent,
    calendarId: string = 'primary',
  ): Promise<calendar_v3.Schema$Event> {
    try {
      const response = await this.calendar.events.insert({
        calendarId,
        requestBody: event,
        sendUpdates: 'all', // Enviar convites por email
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  }

  // Listar eventos do calendário
  async listEvents(
    calendarId: string = 'primary',
    timeMin?: string,
    timeMax?: string,
    maxResults: number = 10,
  ): Promise<calendar_v3.Schema$Event[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin: timeMin || new Date().toISOString(),
        timeMax,
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return (response.data.items as calendar_v3.Schema$Event[]) || [];
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      throw error;
    }
  }

  // Atualizar evento
  async updateEvent(
    eventId: string,
    event: Partial<CalendarEvent>,
    calendarId: string = 'primary',
  ): Promise<calendar_v3.Schema$Event> {
    try {
      const response = await this.calendar.events.update({
        calendarId,
        eventId,
        requestBody: event,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw error;
    }
  }

  // Deletar evento
  async deleteEvent(eventId: string, calendarId: string = 'primary'): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId,
        eventId,
        sendUpdates: 'all',
      });
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      throw error;
    }
  }

  // Verificar disponibilidade
  async checkAvailability(
    emails: string[],
    timeMin: string,
    timeMax: string,
  ): Promise<calendar_v3.Schema$FreeBusyResponse | undefined> {
    try {
      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin,
          timeMax,
          items: emails.map(email => ({ id: email })),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      throw error;
    }
  }
}

// Instância singleton do serviço
export const googleCalendarService = new GoogleCalendarService();
