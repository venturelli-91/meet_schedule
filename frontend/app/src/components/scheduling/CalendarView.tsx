import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Modal } from 'flowbite-react';
import { useGoogleCalendar } from '../../hooks/useGoogleCalendar';
import { CalendarEvent } from '../../services/googleCalendar';

const CalendarView: React.FC = () => {
  const { isAuthenticated, events, loading, error, loadEvents, deleteEvent } = useGoogleCalendar();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents();
    }
  }, [isAuthenticated, loadEvents]);

  const handleDeleteClick = (event: CalendarEvent) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete?.id) {
      await deleteEvent(eventToDelete.id);
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventStatus = (event: CalendarEvent) => {
    const now = new Date();
    const startTime = new Date(event.start.dateTime);
    const endTime = new Date(event.end.dateTime);

    if (now < startTime) {
      return { status: 'upcoming', color: 'blue', text: 'Próximo' };
    } else if (now >= startTime && now <= endTime) {
      return { status: 'ongoing', color: 'green', text: 'Em andamento' };
    } else {
      return { status: 'past', color: 'gray', text: 'Finalizado' };
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Visualizar Eventos</h3>
          <p className="text-gray-600">Faça login no Google Calendar para ver seus eventos.</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando eventos...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <Button onClick={loadEvents} className="mt-4">
            Tentar Novamente
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Meus Eventos</h3>
          <Button onClick={loadEvents} size="sm">
            Atualizar
          </Button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum evento encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => {
              const eventStatus = getEventStatus(event);

              return (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold">{event.summary}</h4>
                        <Badge color={eventStatus.color as any}>{eventStatus.text}</Badge>
                      </div>

                      {event.description && (
                        <p className="text-gray-600 mb-2">{event.description}</p>
                      )}

                      <div className="text-sm text-gray-500 space-y-1">
                        <div>
                          <strong>Início:</strong> {formatDateTime(event.start.dateTime)}
                        </div>
                        <div>
                          <strong>Fim:</strong> {formatDateTime(event.end.dateTime)}
                        </div>

                        {event.attendees && event.attendees.length > 0 && (
                          <div>
                            <strong>Participantes:</strong>{' '}
                            {event.attendees.map(attendee => attendee.email).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button size="xs" color="failure" onClick={() => handleDeleteClick(event)}>
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal de confirmação de exclusão */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md">
        <Modal.Header>Confirmar Exclusão</Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza que deseja excluir o evento "{eventToDelete?.summary}"? Esta ação não pode
            ser desfeita.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={confirmDelete}>
            Sim, Excluir
          </Button>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarView;
