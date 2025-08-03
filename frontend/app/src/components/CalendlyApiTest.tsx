import React, { useState } from 'react';
import { Card, Button, TextInput, Alert, Badge } from 'flowbite-react';
import { HiCheck, HiX, HiKey } from 'react-icons/hi';

const CalendlyApiTest: React.FC = () => {
  const [apiToken, setApiToken] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    success: boolean;
    user?: {
      name: string;
      email: string;
      slug: string;
      timezone: string;
      uri: string;
    };
    eventTypes?: {
      name: string;
      duration: number;
      type: string;
      slug: string;
    }[];
    events?: {
      name: string;
      start_time: string;
      status: string;
      uri: string;
    }[];
    error?: string;
  } | null>(null);

  const runTest = async () => {
    if (!apiToken.trim()) {
      alert('Por favor, insira um token da API');
      return;
    }

    setTesting(true);
    setTestResults(null);

    try {
      console.log('🧪 Iniciando teste da API Calendly...');

      // Teste 1: Verificar usuário atual
      console.log('📋 Teste 1: Obtendo informações do usuário...');
      const userResponse = await fetch('https://api.calendly.com/users/me', {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        throw new Error(
          `Erro na API: ${userResponse.status} - ${errorData.message || userResponse.statusText}`,
        );
      }

      const userData = await userResponse.json();
      const user = userData.resource;
      console.log('✅ Usuário obtido:', user);

      // Teste 2: Listar tipos de evento
      console.log('📋 Teste 2: Listando tipos de evento...');
      const eventTypesResponse = await fetch(
        `https://api.calendly.com/event_types?user=${encodeURIComponent(user.uri)}`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!eventTypesResponse.ok) {
        throw new Error(`Erro ao obter tipos de evento: ${eventTypesResponse.status}`);
      }

      const eventTypesData = await eventTypesResponse.json();
      const eventTypes = eventTypesData.collection;
      console.log('✅ Tipos de evento obtidos:', eventTypes);

      // Teste 3: Listar eventos agendados
      console.log('📋 Teste 3: Listando eventos agendados...');
      const eventsResponse = await fetch(
        `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(user.uri)}&count=10`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!eventsResponse.ok) {
        throw new Error(`Erro ao obter eventos: ${eventsResponse.status}`);
      }

      const eventsData = await eventsResponse.json();
      const events = eventsData.collection;
      console.log('✅ Eventos obtidos:', events);

      setTestResults({
        success: true,
        user,
        eventTypes,
        events,
      });

      console.log('🎉 Todos os testes passaram com sucesso!');
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🧪 Teste da API Calendly</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token da API Calendly
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiKey className="h-5 w-5 text-gray-400" />
                </div>
                <TextInput
                  type="password"
                  placeholder="Insira seu token da API Calendly"
                  value={apiToken}
                  onChange={e => setApiToken(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={runTest}
                disabled={testing || !apiToken.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {testing ? 'Testando...' : 'Executar Teste'}
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              <strong>O que este teste faz:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Verifica se o token é válido</li>
              <li>Obtém informações do seu usuário Calendly</li>
              <li>Lista seus tipos de evento disponíveis</li>
              <li>Lista seus eventos agendados</li>
            </ul>
          </div>
        </div>
      </Card>

      {testResults && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {testResults.success ? (
                <>
                  <HiCheck className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">
                    ✅ Teste realizado com sucesso!
                  </h3>
                </>
              ) : (
                <>
                  <HiX className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900">❌ Teste falhou</h3>
                </>
              )}
            </div>

            {testResults.success ? (
              <div className="space-y-4">
                {/* Informações do usuário */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">👤 Informações do Usuário</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Nome:</strong> {testResults.user?.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {testResults.user?.email}
                    </div>
                    <div>
                      <strong>Slug:</strong> @{testResults.user?.slug}
                    </div>
                    <div>
                      <strong>Timezone:</strong> {testResults.user?.timezone}
                    </div>
                  </div>
                </div>

                {/* Tipos de evento */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    📅 Tipos de Evento ({testResults.eventTypes?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {testResults.eventTypes?.map((eventType, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white rounded"
                      >
                        <div>
                          <span className="font-medium">{eventType.name}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            ({eventType.duration} min)
                          </span>
                        </div>
                        <Badge color="blue">{eventType.type}</Badge>
                      </div>
                    ))}
                    {(!testResults.eventTypes || testResults.eventTypes.length === 0) && (
                      <p className="text-sm text-gray-600">Nenhum tipo de evento encontrado</p>
                    )}
                  </div>
                </div>

                {/* Eventos agendados */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    🗓️ Eventos Agendados ({testResults.events?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {testResults.events?.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white rounded"
                      >
                        <div>
                          <span className="font-medium">{event.name}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            {new Date(event.start_time).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <Badge color={event.status === 'active' ? 'success' : 'failure'}>
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                    {(!testResults.events || testResults.events.length === 0) && (
                      <p className="text-sm text-gray-600">Nenhum evento agendado encontrado</p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>🎉 Parabéns!</strong> Sua API do Calendly está funcionando
                    perfeitamente. Você pode agora usar a aplicação principal com confiança.
                  </p>
                </div>
              </div>
            ) : (
              <Alert color="failure">
                <div className="space-y-2">
                  <p>
                    <strong>Erro encontrado:</strong>
                  </p>
                  <code className="text-xs">{testResults.error}</code>

                  <div className="mt-4">
                    <p>
                      <strong>Possíveis soluções:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Verifique se o token está correto</li>
                      <li>Confirme se o token tem as permissões necessárias</li>
                      <li>Verifique se sua conta Calendly está ativa</li>
                      <li>
                        Tente gerar um novo token em:
                        <a
                          href="https://calendly.com/app/settings/developer"
                          target="_blank"
                          className="text-blue-600 underline ml-1"
                        >
                          calendly.com/app/settings/developer
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Alert>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CalendlyApiTest;
