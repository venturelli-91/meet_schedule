import React, { useState, useEffect } from 'react';
import { Card, Button, Label, Select, TextInput, Badge, Alert } from 'flowbite-react';
import { HiExternalLink, HiClipboard, HiCheck } from 'react-icons/hi';
import { useCalendly } from '../../hooks/useCalendly';

interface MeetingSchedulerProps {
  calendlyHook: ReturnType<typeof useCalendly>;
}

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ calendlyHook }) => {
  const { isAuthenticated, eventTypes, loading, error, generateSchedulingLink } = calendlyHook;

  const [selectedEventType, setSelectedEventType] = useState('');
  const [linkOptions, setLinkOptions] = useState({
    name: '',
    email: '',
    hide_gdpr_banner: true,
    hide_landing_page_details: false,
    hide_event_type_details: false,
    primary_color: '0069ff',
    background_color: 'ffffff',
    text_color: '333333',
  });
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Resetar link copiado após 3 segundos
  useEffect(() => {
    if (linkCopied) {
      const timer = setTimeout(() => setLinkCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [linkCopied]);

  // Gerar link de agendamento
  const handleGenerateLink = () => {
    if (!selectedEventType) {
      alert('Por favor, selecione um tipo de evento');
      return;
    }

    const selectedType = eventTypes.find(type => type.slug === selectedEventType);
    if (!selectedType) {
      alert('Tipo de evento não encontrado');
      return;
    }

    const link = generateSchedulingLink(selectedEventType, {
      ...linkOptions,
      // Remover campos vazios
      name: linkOptions.name || undefined,
      email: linkOptions.email || undefined,
    });

    if (link) {
      setGeneratedLink(link);
    }
  };

  // Copiar link para clipboard
  const copyToClipboard = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = generatedLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
    }
  };

  // Abrir link em nova aba
  const openInNewTab = () => {
    if (generatedLink) {
      window.open(generatedLink, '_blank');
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            Conecte-se ao Calendly para começar a gerar links de agendamento
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Gerar Link de Agendamento</h3>

        {error && (
          <Alert color="failure" className="mb-4">
            <span className="font-medium">Erro:</span> {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seleção do tipo de evento */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventType">Tipo de Evento</Label>
              <Select
                id="eventType"
                value={selectedEventType}
                onChange={e => setSelectedEventType(e.target.value)}
                disabled={loading}
              >
                <option value="">Selecione um tipo de evento</option>
                {eventTypes.map(type => (
                  <option key={type.uri} value={type.slug}>
                    {type.name} ({type.duration} min)
                  </option>
                ))}
              </Select>
            </div>

            {/* Informações de pré-preenchimento */}
            <div>
              <Label htmlFor="guestName">Nome do Convidado (opcional)</Label>
              <TextInput
                id="guestName"
                type="text"
                placeholder="Nome será pré-preenchido no formulário"
                value={linkOptions.name}
                onChange={e => setLinkOptions(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="guestEmail">Email do Convidado (opcional)</Label>
              <TextInput
                id="guestEmail"
                type="email"
                placeholder="Email será pré-preenchido no formulário"
                value={linkOptions.email}
                onChange={e => setLinkOptions(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          {/* Customizações */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Personalização</h4>

            <div>
              <Label htmlFor="primaryColor">Cor Principal</Label>
              <div className="flex items-center space-x-2">
                <TextInput
                  id="primaryColor"
                  type="text"
                  placeholder="0069ff"
                  value={linkOptions.primary_color}
                  onChange={e =>
                    setLinkOptions(prev => ({ ...prev, primary_color: e.target.value }))
                  }
                  className="flex-1"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: `#${linkOptions.primary_color}` }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="backgroundColor">Cor de Fundo</Label>
              <div className="flex items-center space-x-2">
                <TextInput
                  id="backgroundColor"
                  type="text"
                  placeholder="ffffff"
                  value={linkOptions.background_color}
                  onChange={e =>
                    setLinkOptions(prev => ({ ...prev, background_color: e.target.value }))
                  }
                  className="flex-1"
                />
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: `#${linkOptions.background_color}` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Opções de Exibição</Label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={linkOptions.hide_gdpr_banner}
                  onChange={e =>
                    setLinkOptions(prev => ({ ...prev, hide_gdpr_banner: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Ocultar banner GDPR</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={linkOptions.hide_landing_page_details}
                  onChange={e =>
                    setLinkOptions(prev => ({
                      ...prev,
                      hide_landing_page_details: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Ocultar detalhes da página inicial</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={linkOptions.hide_event_type_details}
                  onChange={e =>
                    setLinkOptions(prev => ({ ...prev, hide_event_type_details: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Ocultar detalhes do tipo de evento</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleGenerateLink}
            disabled={loading || !selectedEventType}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Gerar Link de Agendamento
          </Button>
        </div>
      </Card>

      {/* Link gerado */}
      {generatedLink && (
        <Card>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Link de Agendamento Gerado</h4>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Compartilhe este link com seus convidados:</p>

            <div className="flex items-center space-x-2 bg-white p-3 rounded border">
              <code className="flex-1 text-sm text-blue-600 break-all">{generatedLink}</code>

              <div className="flex space-x-1">
                <Button
                  size="sm"
                  color="gray"
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1"
                >
                  {linkCopied ? (
                    <>
                      <HiCheck className="w-4 h-4" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <HiClipboard className="w-4 h-4" />
                      <span>Copiar</span>
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  color="blue"
                  onClick={openInNewTab}
                  className="flex items-center space-x-1"
                >
                  <HiExternalLink className="w-4 h-4" />
                  <span>Abrir</span>
                </Button>
              </div>
            </div>
          </div>

          {selectedEventType && (
            <div className="mt-4">
              <h5 className="font-medium text-gray-900 mb-2">Informações do Evento:</h5>
              {eventTypes
                .filter(type => type.slug === selectedEventType)
                .map(type => (
                  <div key={type.uri} className="bg-blue-50 p-3 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-blue-900">{type.name}</h6>
                      <Badge color="blue">{type.duration} minutos</Badge>
                    </div>

                    {type.description_plain && (
                      <p className="text-sm text-blue-700">{type.description_plain}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default MeetingScheduler;
