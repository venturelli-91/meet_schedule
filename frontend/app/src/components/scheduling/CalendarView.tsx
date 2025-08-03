import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Modal, Alert, TextInput, Spinner } from 'flowbite-react';
import { HiCalendar, HiClock, HiMail, HiUser, HiExclamation, HiRefresh } from 'react-icons/hi';
import { useCalendly } from '../../hooks/useCalendly';
import { CalendlyEvent, CalendlyInvitee } from '../../services/calendlyService';

interface CalendarViewProps {
  calendlyHook: ReturnType<typeof useCalendly>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ calendlyHook }) => {
  const { isAuthenticated, events, loading, error, loadEvents, cancelEvent, getEventInvitees } =
    calendlyHook;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [eventToCancel, setEventToCancel] = useState<CalendlyEvent | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showInviteesModal, setShowInviteesModal] = useState(false);
  const [selectedEventInvitees, setSelectedEventInvitees] = useState<CalendlyInvitee[]>([]);
  const [loadingInvitees, setLoadingInvitees] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents({
        minStartTime: new Date().toISOString(),
        status: 'active',
      });
    }
  }, [isAuthenticated, loadEvents]);

  const handleCancelClick = (event: CalendlyEvent) => {
    setEventToCancel(event);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!eventToCancel) return;

    const success = await cancelEvent(
      eventToCancel.uri,
      cancelReason || 'Cancelado pelo organizador',
    );

    if (success) {
      setShowCancelModal(false);
      setEventToCancel(null);
      setCancelReason('');
    }
  };

  const handleViewInvitees = async (event: CalendlyEvent) => {
    setLoadingInvitees(true);
    setShowInviteesModal(true);

    try {
      const invitees = await getEventInvitees(event.uri);
      setSelectedEventInvitees(invitees);
    } catch (err) {
      console.error('Erro ao carregar participantes:', err);
    } finally {
      setLoadingInvitees(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventStatus = (event: CalendlyEvent) => {
    const now = new Date();
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);

    if (event.status === 'canceled') {
      return { label: 'Cancelado', color: 'failure' as const };
    }

    if (now < startTime) {
      return { label: 'Agendado', color: 'info' as const };
    } else if (now >= startTime && now <= endTime) {
      return { label: 'Em andamento', color: 'success' as const };
    } else {
      return { label: 'Concluído', color: 'gray' as const };
    }
  };

  const handleRefresh = () => {
    loadEvents({
      minStartTime: new Date().toISOString(),
      status: 'active',
    });
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <div className="text-center">
          <HiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            Conecte-se ao Calendly para visualizar seus eventos agendados
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Eventos Agendados</h3>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          color="gray"
          size="sm"
          className="flex items-center space-x-1"
        >
          <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </Button>
      </div>

      {error && (
        <Alert color="failure">
          <span className="font-medium">Erro:</span> {error}
        </Alert>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      )}

      {!loading && events.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <HiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h4>
            <p className="text-gray-500">Você não tem eventos agendados no momento.</p>
          </div>
        </Card>
      )}

      {!loading && events.length > 0 && (
        <div className="space-y-4">
          {events.map(event => {
            const status = getEventStatus(event);

            return (
              <Card key={event.uri} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900">{event.name}</h4>
                      <Badge color={status.color}>{status.label}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <HiCalendar className="w-4 h-4" />
                        <span>{formatDate(event.start_time)}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <HiClock className="w-4 h-4" />
                        <span>
                          {formatTime(event.start_time)} - {formatTime(event.end_time)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <HiUser className="w-4 h-4" />
                        <span>
                          {event.invitees_counter.active} de {event.invitees_counter.limit}{' '}
                          participantes
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center space-x-2">
                          <HiMail className="w-4 h-4" />
                          <span>{event.location.type}</span>
                        </div>
                      )}
                    </div>

                    {event.meeting_notes_plain && (
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{event.meeting_notes_plain}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button size="sm" color="gray" onClick={() => handleViewInvitees(event)}>
                    Ver Participantes
                  </Button>

                  {event.status === 'active' && new Date(event.start_time) > new Date() && (
                    <Button size="sm" color="failure" onClick={() => handleCancelClick(event)}>
                      Cancelar Evento
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal show={showCancelModal} onClose={() => setShowCancelModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancelar Evento</h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-yellow-600">
              <HiExclamation className="w-5 h-5" />
              <span className="font-medium">Tem certeza que deseja cancelar este evento?</span>
            </div>

            {eventToCancel && (
              <div className="p-3 bg-gray-50 rounded">
                <h5 className="font-medium text-gray-900">{eventToCancel.name}</h5>
                <p className="text-sm text-gray-600">
                  {formatDate(eventToCancel.start_time)} às {formatTime(eventToCancel.start_time)}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo do cancelamento (opcional)
              </label>
              <TextInput
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Informe o motivo do cancelamento..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button color="failure" onClick={handleConfirmCancel} disabled={loading}>
              {loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
            </Button>
            <Button color="gray" onClick={() => setShowCancelModal(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal show={showInviteesModal} onClose={() => setShowInviteesModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participantes do Evento</h3>

          {loadingInvitees ? (
            <div className="flex justify-center py-4">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEventInvitees.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum participante encontrado.</p>
              ) : (
                selectedEventInvitees.map(invitee => (
                  <div
                    key={invitee.uri}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{invitee.name}</p>
                      <p className="text-sm text-gray-600">{invitee.email}</p>
                      <p className="text-xs text-gray-500">Fuso horário: {invitee.timezone}</p>
                    </div>
                    <Badge color={invitee.canceled ? 'failure' : 'success'}>
                      {invitee.canceled ? 'Cancelado' : 'Confirmado'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button color="gray" onClick={() => setShowInviteesModal(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarView;
