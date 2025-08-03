# Sistema de Agendamento de Reuniões - Google Calendar Integration

## Configuração do Google Calendar API

Para usar a integração com Google Calendar, você precisa configurar as credenciais da API do Google.

### 1. Criar um Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs & Services" > "Library"
4. Procure por "Google Calendar API" e habilite

### 2. Configurar OAuth 2.0

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure o "Authorized JavaScript origins":
   - Para desenvolvimento: `http://localhost:3000`
   - Para produção: `https://seu-dominio.com`
4. Configure o "Authorized redirect URIs":
   - Para desenvolvimento: `http://localhost:3000/auth/callback`
   - Para produção: `https://seu-dominio.com/auth/callback`

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` com suas credenciais:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id_aqui
   NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
   NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

### 4. Funcionalidades Disponíveis

- **Autenticação com Google**: Login seguro usando OAuth 2.0
- **Criar Eventos**: Agende reuniões diretamente no Google Calendar
- **Listar Eventos**: Visualize todos os seus eventos
- **Verificar Disponibilidade**: Verifique conflitos de horário
- **Excluir Eventos**: Remova reuniões diretamente da aplicação
- **Envio de Convites**: Convites automáticos por email para participantes

### 5. Como Usar

1. **Primeira vez**: Clique em "Conectar com Google" para autorizar a aplicação
2. **Agendar Reunião**:
   - Preencha o formulário com título, data, horário e participantes
   - Use "Verificar Disponibilidade" para ver conflitos
   - Clique em "Agendar Reunião" para criar o evento
3. **Visualizar Eventos**: Vá para a aba "Meus Eventos" para ver e gerenciar reuniões

### 6. Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Acessar a aplicação
http://localhost:3000
```

### 7. Tecnologias Utilizadas

- **Next.js**: Framework React
- **Google APIs**: Integração com Google Calendar
- **Flowbite React**: Componentes UI
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização

### 8. Estrutura do Projeto

```
src/
├── components/
│   ├── scheduling/
│   │   ├── MeetingScheduler.tsx    # Formulário de agendamento
│   │   └── CalendarView.tsx        # Visualização de eventos
│   └── ui/
│       └── LanguageNavbar.tsx      # Navegação com idiomas
├── hooks/
│   └── useGoogleCalendar.ts        # Hook para Google Calendar
├── services/
│   └── googleCalendar.ts           # Serviço da API do Google
└── pages/
    └── index.tsx                   # Página principal
```

### 9. Segurança

- As credenciais nunca são expostas no frontend
- Tokens de acesso são armazenados localmente de forma segura
- Todas as requisições usam HTTPS em produção
- Scopes mínimos necessários para funcionar

### 10. Suporte

Para problemas ou dúvidas:

- Verifique se as credenciais estão corretas
- Confirme se a Google Calendar API está habilitada
- Verifique se os domínios estão configurados corretamente no OAuth
