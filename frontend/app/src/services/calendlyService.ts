const CALENDLY_API_BASE = 'https://api.calendly.com';

export interface CalendlyUser {
  uri: string;
  name: string;
  slug: string;
  email: string;
  timezone: string;
  avatar_url?: string;
  scheduling_url: string;
  created_at: string;
  updated_at: string;
}

export interface CalendlyEventType {
  uri: string;
  name: string;
  slug: string;
  scheduling_url: string;
  duration: number;
  kind: string;
  pooling_type?: string;
  type: string;
  color: string;
  created_at: string;
  updated_at: string;
  internal_note?: string;
  description_plain?: string;
  description_html?: string;
}

export interface CalendlyEvent {
  uri: string;
  name: string;
  meeting_notes_plain?: string;
  meeting_notes_html?: string;
  status: 'active' | 'canceled';
  start_time: string;
  end_time: string;
  event_type: string;
  location?: {
    type: string;
    location?: string;
    join_url?: string;
  };
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CalendlyInvitee {
  uri: string;
  name: string;
  email: string;
  text_reminder_number?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  canceled: boolean;
  cancellation?: {
    canceled_by: string;
    reason?: string;
    canceler_type: 'host' | 'invitee';
    created_at: string;
  };
}

export class CalendlyService {
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${CALENDLY_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Calendly API Error: ${response.status} - ${errorData.message || response.statusText}`,
      );
    }

    return response.json();
  }

  // Obter informações do usuário atual
  async getCurrentUser(): Promise<CalendlyUser> {
    const response = await this.makeRequest<{ resource: CalendlyUser }>('/users/me');
    return response.resource;
  }

  // Listar tipos de evento do usuário
  async getEventTypes(userUri: string): Promise<CalendlyEventType[]> {
    const response = await this.makeRequest<{ collection: CalendlyEventType[] }>(
      `/event_types?user=${encodeURIComponent(userUri)}`,
    );
    return response.collection;
  }

  // Listar eventos agendados
  async getScheduledEvents(
    userUri: string,
    options: {
      minStartTime?: string;
      maxStartTime?: string;
      status?: 'active' | 'canceled';
      sort?: 'start_time:asc' | 'start_time:desc' | 'created_at:asc' | 'created_at:desc';
      count?: number;
    } = {},
  ): Promise<CalendlyEvent[]> {
    const params = new URLSearchParams({
      user: userUri,
      ...Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined)),
    });

    const response = await this.makeRequest<{ collection: CalendlyEvent[] }>(
      `/scheduled_events?${params.toString()}`,
    );
    return response.collection;
  }

  // Obter detalhes de um evento específico
  async getEvent(eventUri: string): Promise<CalendlyEvent> {
    const response = await this.makeRequest<{ resource: CalendlyEvent }>(
      `/scheduled_events/${encodeURIComponent(eventUri)}`,
    );
    return response.resource;
  }

  // Listar participantes de um evento
  async getEventInvitees(eventUri: string): Promise<CalendlyInvitee[]> {
    const response = await this.makeRequest<{ collection: CalendlyInvitee[] }>(
      `/scheduled_events/${encodeURIComponent(eventUri)}/invitees`,
    );
    return response.collection;
  }

  // Cancelar um evento (apenas o host pode cancelar)
  async cancelEvent(eventUri: string, reason?: string): Promise<CalendlyEvent> {
    const response = await this.makeRequest<{ resource: CalendlyEvent }>(
      `/scheduled_events/${encodeURIComponent(eventUri)}/cancellation`,
      {
        method: 'POST',
        body: JSON.stringify({
          reason: reason || 'Cancelado pelo organizador',
        }),
      },
    );
    return response.resource;
  }

  // Obter link de agendamento para um tipo de evento
  getSchedulingUrl(eventTypeSlug: string, userSlug: string): string {
    return `https://calendly.com/${userSlug}/${eventTypeSlug}`;
  }

  // Gerar link de agendamento com parâmetros personalizados
  generateSchedulingLink(
    eventTypeSlug: string,
    userSlug: string,
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
  ): string {
    const baseUrl = this.getSchedulingUrl(eventTypeSlug, userSlug);
    const params = new URLSearchParams();

    // Adicionar parâmetros de pré-preenchimento
    if (options.name) params.append('name', options.name);
    if (options.email) params.append('email', options.email);
    if (options.text_reminder_number)
      params.append('text_reminder_number', options.text_reminder_number);

    // Adicionar parâmetros de customização
    if (options.hide_gdpr_banner) params.append('hide_gdpr_banner', '1');
    if (options.hide_landing_page_details) params.append('hide_landing_page_details', '1');
    if (options.hide_event_type_details) params.append('hide_event_type_details', '1');
    if (options.background_color) params.append('background_color', options.background_color);
    if (options.text_color) params.append('text_color', options.text_color);
    if (options.primary_color) params.append('primary_color', options.primary_color);

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }
}
