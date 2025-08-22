'use client';
import React, { useState } from 'react';
import { HiCalendar, HiKey } from 'react-icons/hi';
import LanguageNavbar from '../components/ui/LanguageNavbar';
import MeetingScheduler from '../components/scheduling/MeetingScheduler';
import CalendarView from '../components/scheduling/CalendarView';
import { useCalendly } from '../hooks/useCalendly';
import { TextInput, Button, Card, Alert } from 'flowbite-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [apiToken, setApiToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const calendlyHook = useCalendly();

  const handleConnect = () => {
    if (!apiToken.trim()) {
      alert('Por favor, insira seu token da API do Calendly');
      return;
    }

    calendlyHook.initializeCalendly(apiToken);
    setShowTokenInput(false);
  };

  const handleDisconnect = () => {
    setShowTokenInput(true);
    setApiToken('');

    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gerenciamento de reuniões inteligente
          </h1>
          <p className="text-lg text-gray-600">Bem-vindo, Aurélio. Confira sua agenda</p>
        </div>

        {(showTokenInput || !calendlyHook.isAuthenticated) && (
          <div className="max-w-md mx-auto mb-8">
            <Card>
              <div className="text-center">
                <HiCalendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Conectar ao Calendly</h2>
                <p className="text-gray-600 mb-6">Insira seu token API Calendly</p>

                {calendlyHook.error && (
                  <Alert color="failure" className="mb-4">
                    <span className="font-medium">Erro:</span> {calendlyHook.error}
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="flex">
                    <HiKey className="w-5 h-5 text-gray-500" />
                    <TextInput
                      type="password"
                      placeholder="Seu token da API Calendly"
                      value={apiToken}
                      onChange={e => setApiToken(e.target.value)}
                      className="flex-1"
                      onKeyDown={e => e.key === 'Enter' && handleConnect()}
                    />
                  </div>

                  <Button
                    onClick={handleConnect}
                    disabled={calendlyHook.loading || !apiToken.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {calendlyHook.loading ? 'Conectando...' : 'Conectar ao Calendly'}
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded text-left">
                  <h4 className="font-medium text-blue-900 mb-2">Como obter seu token:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>
                      1. Acesse{' '}
                      <a
                        href="https://calendly.com/app/settings/developer"
                        target="_blank"
                        rel="noopener"
                        className="underline"
                      >
                        calendly.com/app/settings/developer
                      </a>
                    </li>
                    <li>2. Clique em &quot;Create new token&quot;</li>
                    <li>3. Dê um nome ao token e defina as permissões</li>
                    <li>4. Copie o token gerado e cole aqui</li>
                  </ol>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Interface principal - só mostra se conectado */}
        {calendlyHook.isAuthenticated && calendlyHook.user && (
          <>
            {/* Informações do usuário conectado */}
            <div className="max-w-4xl mx-auto mb-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Conectado como: {calendlyHook.user.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {calendlyHook.user.email} • {calendlyHook.eventTypes.length} tipos de evento
                      </p>
                    </div>
                  </div>
                  <Button color="gray" size="sm" onClick={handleDisconnect}>
                    Desconectar
                  </Button>
                </div>
              </Card>
            </div>

            {/* Navegação das tabs */}
            <div className="max-w-6xl mx-auto">
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'schedule'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Gerar Links de Agendamento
                  </button>

                  <button
                    onClick={() => setActiveTab('events')}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'events'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Meus Eventos ({calendlyHook.events.length})
                  </button>
                </nav>
              </div>

              {/* Conteúdo das tabs */}
              <div className="py-6">
                {activeTab === 'schedule' && <MeetingScheduler calendlyHook={calendlyHook} />}
                {activeTab === 'events' && <CalendarView calendlyHook={calendlyHook} />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
