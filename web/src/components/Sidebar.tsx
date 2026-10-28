import React from 'react';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  DollarSign,
  Activity,
  QrCode,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { User } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Alunos & Matrículas', icon: Users },
    { id: 'checkin', label: 'Catraca & Check-in', icon: QrCode },
    { id: 'workouts', label: 'Fichas & Exercícios', icon: Dumbbell },
    { id: 'assessments', label: 'Avaliação Física', icon: Activity },
    { id: 'financial', label: 'Financeiro & Planos', icon: DollarSign },
  ];

  const handleSelect = (id: string) => {
    setCurrentTab(id);
    setIsMobileOpen(false);
  };

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    gestor: 'Gestor Geral',
    recepcao: 'Recepção',
    personal: 'Personal Trainer',
    avaliador: 'Avaliador Físico',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-brand-surface border-r border-brand-border transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Logo & Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-brand-border">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src="/logo_helmans_icon.webp"
                alt="HA Logo"
                className="w-10 h-10 object-contain shrink-0"
                loading="lazy"
                decoding="async"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-wider text-white uppercase font-sans">
                  Helmans <span className="text-brand-gold">Academy</span>
                </span>
                <span className="text-[10px] text-brand-muted tracking-widest uppercase">
                  Gestão & Performance
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <img
                src="/logo_helmans_icon.webp"
                alt="HA Logo"
                className="w-10 h-10 object-contain"
                loading="lazy"
              />
            </div>
          )}

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-brand-card hover:bg-brand-border text-brand-muted hover:text-white transition-colors"
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-brand-gold/15 text-brand-gold shadow-gold-sm border border-brand-gold/30'
                    : 'text-gray-400 hover:text-white hover:bg-brand-card'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  size={20}
                  className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-brand-gold' : 'text-gray-400 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-brand-gold rounded-r-full lg:block hidden" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-brand-border bg-brand-black/30">
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-brand-card/80 border border-brand-border/60">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-lg bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold font-bold text-xs shrink-0">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'HA'}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-white truncate">
                    {user?.name || 'Operador'}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-brand-gold font-medium">
                    <ShieldCheck size={11} />
                    <span>{user ? roleLabels[user.role] || user.role : 'Staff'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Sair do sistema"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              title="Sair do sistema"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
