'use client';
import React, { useState } from 'react';
import LanguageNavbar from '../components/ui/LanguageNavbar';
import MeetingScheduler from '../components/scheduling/MeetingScheduler';
import CalendarView from '../components/scheduling/CalendarView';

export default function Home() {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Agendamento de Reuniões
          </h1>
          <p className="text-lg text-gray-600">
            Integrado com Google Calendar para facilitar o agendamento e gerenciamento de suas
            reuniões
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Navegação customizada das tabs */}
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
                Agendar Reunião
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Meus Eventos
              </button>
            </nav>
          </div>

          {/* Conteúdo das tabs */}
          <div className="py-6">
            {activeTab === 'schedule' && <MeetingScheduler />}
            {activeTab === 'events' && <CalendarView />}
          </div>
        </div>
      </div>
    </div>
  );
}
