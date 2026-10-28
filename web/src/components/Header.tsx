import React from 'react';
import { Menu, QrCode, Wifi } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenMobileMenu: () => void;
  onOpenQuickCheckIn: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onOpenQuickCheckIn,
}) => {
  const titles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Visão Geral da Academia',
      subtitle: 'Monitoramento em tempo real de alunos, receita e acessos',
    },
    members: {
      title: 'Alunos & Matrículas',
      subtitle: 'Controle cadastral, status financeiro e ficha de membros',
    },
    checkin: {
      title: 'Terminal de Catraca & Acessos',
      subtitle: 'Validação instantânea por código, biometria ou QR Code',
    },
    workouts: {
      title: 'Fichas de Treino & Exercícios',
      subtitle: 'Biblioteca muscular, divisões A/B/C/D e progressão de cargas',
    },
    assessments: {
      title: 'Avaliação Física & Antropometria',
      subtitle: 'Composição corporal, percentual de gordura e circunferências',
    },
    financial: {
      title: 'Financeiro, Faturas & Planos',
      subtitle: 'Gestão de mensalidades, baixas e controle de inadimplência',
    },
  };

  const current = titles[currentTab] || {
    title: 'Helmans Academy',
    subtitle: 'Painel de Gestão',
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-brand-surface/90 backdrop-blur-md border-b border-brand-border px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Button & Titles */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-gray-300 hover:text-white transition-colors"
          style={{ minWidth: '44px', minHeight: '44px' }} // Diretriz #8.1 Touch target 44x44px
          aria-label="Abrir menu de navegação"
        >
          <Menu size={22} />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {current.title}
          </h1>
          <p className="hidden sm:block text-xs text-brand-muted">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Action & Status */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Catraca Online Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="flex items-center gap-1.5">
            <Wifi size={12} />
            Catraca Conectada
          </span>
        </div>

        {/* Quick Check-in Button */}
        <button
          onClick={onOpenQuickCheckIn}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold text-xs sm:text-sm tracking-wide transition-all shadow-gold-sm hover:scale-[1.02] active:scale-[0.98]"
          style={{ minHeight: '44px' }}
        >
          <QrCode size={18} className="shrink-0" />
          <span className="hidden xs:inline">Check-in</span>
          <span>Catraca</span>
        </button>
      </div>
    </header>
  );
};
