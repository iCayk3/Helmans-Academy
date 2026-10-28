import React from 'react';
import { Clock, CheckCircle2, Calendar } from 'lucide-react';
import { getGymOpenStatus } from '../utils/formatters';

export const ScheduleSection: React.FC = () => {
  const currentStatus = getGymOpenStatus();

  const schedules = [
    {
      days: 'Segunda a Sexta-feira',
      hours: '05:00 às 23:00',
      tag: '18 Horas Ininterruptas',
      highlight: true,
    },
    {
      days: 'Sábados',
      hours: '08:00 às 18:00',
      tag: 'Dia Todo',
      highlight: false,
    },
    {
      days: 'Domingos e Feriados',
      hours: '08:00 às 14:00',
      tag: 'Treino de Final de Semana',
      highlight: false,
    },
  ];

  return (
    <section id="horarios" className="py-20 bg-brand-surface border-y border-brand-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold tracking-wider uppercase mb-3">
              Flexibilidade de Horário
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-display mb-3">
              Horários de <span className="text-brand-gold">Funcionamento</span>
            </h2>
            <p className="text-zinc-400 text-sm">
              Treine cedo antes do trabalho ou tarde da noite. A Helmans Academy se adapta à sua rotina.
            </p>
          </div>

          {/* Live Dynamic Status Card */}
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-brand-dark border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
            <div className="flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  currentStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-zinc-500'
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Status da Academia:</span>
                  <span
                    className={`text-xs sm:text-sm font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      currentStatus.isOpen
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {currentStatus.message}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{currentStatus.closingOrOpeningText}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-brand-surface px-3 py-1.5 rounded-xl border border-brand-border">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span>Horário de Brasília</span>
            </div>
          </div>

          {/* Schedule Table Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schedules.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  item.highlight
                    ? 'bg-brand-dark border-brand-gold/40 shadow-gold-sm'
                    : 'bg-brand-dark/60 border-brand-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {item.tag}
                    </span>
                    <Calendar className="w-4 h-4 text-brand-gold" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.days}</h3>
                  <p className="text-2xl font-black text-white font-display mb-1 text-glow-gold">
                    {item.hours}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-border/60 text-xs text-zinc-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Acesso livre para todos os planos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
