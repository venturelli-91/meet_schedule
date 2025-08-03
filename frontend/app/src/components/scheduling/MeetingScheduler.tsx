import React, { useState } from 'react';
import { Card, Button, Label, TextInput, Textarea, Select } from 'flowbite-react';
import { useGoogleCalendar } from '../../hooks/useGoogleCalendar';
import { CalendarEvent } from '../../services/googleCalendar';

const MeetingScheduler: React.FC = () => {
  const { isAuthenticated, loading, error, authenticate, createEvent, checkAvailability } =
    useGoogleCalendar();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: '',
    timeZone: 'America/Sao_Paulo',
  });

  const [availabilityResult, setAvailabilityResult] = useState<unknown>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckAvailability = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.attendees) {
      alert('Por favor, preencha data, horários e participantes');
      return;
    }

    setIsChecking(true);
    const emails = formData.attendees.split(',').map(email => email.trim());
    const startDateTime = `${formData.date}T${formData.startTime}:00`;
    const endDateTime = `${formData.date}T${formData.endTime}:00`;

    try {
      const result = await checkAvailability(emails, startDateTime, endDateTime);
      setAvailabilityResult(result);
    } catch (err) {
      console.error('Erro ao verificar disponibilidade:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Por favor, faça login no Google primeiro');
      return;
    }

    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const startDateTime = `${formData.date}T${formData.startTime}:00`;
    const endDateTime = `${formData.date}T${formData.endTime}:00`;

    const event: CalendarEvent = {
      summary: formData.title,
      description: formData.description,
      start: {
        dateTime: startDateTime,
        timeZone: formData.timeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: formData.timeZone,
      },
      attendees: formData.attendees
        ? formData.attendees.split(',').map(email => ({
            email: email.trim(),
          }))
        : [],
    };

    try {
      await createEvent(event);
      alert('Reunião agendada com sucesso!');
      // Limpar formulário
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        attendees: '',
        timeZone: 'America/Sao_Paulo',
      });
      setAvailabilityResult(null);
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      alert('Erro ao agendar reunião');
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Integração com Google Calendar</h3>
          <p className="text-gray-600 mb-4">
            Para agendar reuniões, você precisa fazer login com sua conta Google.
          </p>
          <Button onClick={authenticate} color="blue">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Conectar com Google
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-6">Agendar Nova Reunião</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Título da Reunião *</Label>
          <TextInput
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ex: Reunião de Planejamento"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descreva o objetivo da reunião..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date">Data *</Label>
            <TextInput
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="startTime">Hora de Início *</Label>
            <TextInput
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="endTime">Hora de Fim *</Label>
            <TextInput
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="timeZone">Fuso Horário</Label>
          <Select
            id="timeZone"
            name="timeZone"
            value={formData.timeZone}
            onChange={handleInputChange}
          >
            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
            <option value="America/New_York">Nova York (GMT-5)</option>
            <option value="Europe/London">Londres (GMT+0)</option>
            <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="attendees">Participantes (emails separados por vírgula)</Label>
          <TextInput
            id="attendees"
            name="attendees"
            value={formData.attendees}
            onChange={handleInputChange}
            placeholder="email1@exemplo.com, email2@exemplo.com"
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            color="gray"
            onClick={handleCheckAvailability}
            disabled={isChecking || loading}
          >
            {isChecking ? 'Verificando...' : 'Verificar Disponibilidade'}
          </Button>

          <Button type="submit" color="blue" disabled={loading}>
            {loading ? 'Agendando...' : 'Agendar Reunião'}
          </Button>
        </div>
      </form>

      {availabilityResult !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Resultado da Verificação de Disponibilidade:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(availabilityResult as object, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
};

export default MeetingScheduler;
