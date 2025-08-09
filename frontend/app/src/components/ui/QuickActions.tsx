import React from 'react';
import { HiCalendar, HiPlus, HiCog, HiClock, HiUsers, HiEye } from 'react-icons/hi';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
}

interface QuickActionsProps {
  actions?: QuickAction[];
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, className = '' }) => {
  const defaultActions: QuickAction[] = [
    {
      id: 'new-meeting',
      title: 'Novo Meeting',
      description: 'Agendar novo compromisso',
      icon: HiPlus,
      onClick: () => console.log('Novo meeting'),
      color: 'blue',
    },
    {
      id: 'today-agenda',
      title: 'Agenda Hoje',
      description: 'Ver compromissos de hoje',
      icon: HiCalendar,
      onClick: () => console.log('Agenda hoje'),
      color: 'green',
    },
    {
      id: 'upcoming',
      title: 'Próximos',
      description: 'Meetings da semana',
      icon: HiClock,
      onClick: () => console.log('Próximos meetings'),
      color: 'purple',
    },
    {
      id: 'participants',
      title: 'Participantes',
      description: 'Gerenciar contatos',
      icon: HiUsers,
      onClick: () => console.log('Participantes'),
      color: 'orange',
    },
    {
      id: 'view-all',
      title: 'Ver Todos',
      description: 'Todos os meetings',
      icon: HiEye,
      onClick: () => console.log('Ver todos'),
      color: 'gray',
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Preferências da conta',
      icon: HiCog,
      onClick: () => console.log('Configurações'),
      color: 'red',
    },
  ];

  const actionsToShow = actions || defaultActions;

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
      red: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200',
      gray: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actionsToShow.map(action => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`
                p-4 rounded-lg border transition-all duration-200 
                hover:shadow-md active:scale-95 text-left
                ${getColorClasses(action.color)}
              `}
            >
              <div className="flex items-center mb-2">
                <IconComponent className="w-5 h-5 mr-2" />
                <span className="font-medium text-sm">{action.title}</span>
              </div>
              <p className="text-xs opacity-75">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
