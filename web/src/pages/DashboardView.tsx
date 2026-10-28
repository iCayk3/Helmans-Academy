import React, { useEffect, useState } from 'react';
import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Dumbbell,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';
import type { DashboardMetrics } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenQuickCheckIn: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenQuickCheckIn,
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const data = await api.get<DashboardMetrics>('/dashboard/metrics');
      setMetrics(data);
    } catch (err) {
      console.error('Falha ao carregar métricas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // WebSocket para atualização instantânea de check-ins da catraca
    const wsUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8088/api/v1')
      .replace(/^http/, 'ws')
      .replace(/\/api\/v1$/, '/ws');

    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'new_checkin') {
            // Recarrega métricas para manter o dashboard 100% atualizado
            fetchMetrics();
          }
        } catch {
          // ignore parsing error
        }
      };
    } catch (e) {
      console.warn('WebSocket não disponível no momento:', e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  if (loading && !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-brand-surface rounded-2xl border border-brand-border" />
          ))}
        </div>
        <div className="h-96 bg-brand-surface rounded-2xl border border-brand-border" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Alunos Ativos */}
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Alunos Ativos
            </span>
            <div className="p-2.5 rounded-xl bg-brand-gold/10 text-brand-gold group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {metrics?.total_active_members || 0}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-400">
              <TrendingUp size={14} className="mr-1" />
              {metrics?.retention_rate_pct.toFixed(0)}% retenção
            </span>
          </div>
          <div className="mt-2 text-xs text-brand-muted">
            +{metrics?.new_members_this_month || 0} novas matrículas este mês
          </div>
        </div>

        {/* Faturamento Mensal (MRR) */}
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Receita Mensal (MRR)
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              R$ {(metrics?.monthly_revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Em dia
            </span>
          </div>
          <div className="mt-2 text-xs text-brand-muted">
            Recorrência ativa e faturas liquidadas
          </div>
        </div>

        {/* Check-ins Hoje */}
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-gold/40 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Acessos Hoje (Catraca)
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Activity size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {metrics?.checkins_today || 0}
            </span>
            <span className="flex items-center text-xs font-medium text-blue-400">
              <Clock size={13} className="mr-1" />
              Ao vivo
            </span>
          </div>
          <div className="mt-2 text-xs text-brand-muted">
            Fluxo ativo na academia hoje
          </div>
        </div>

        {/* Inadimplência / Alertas */}
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border hover:border-red-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Inadimplência
            </span>
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {metrics?.total_overdue_members || 0}
            </span>
            <button
              onClick={() => onNavigate('financial')}
              className="text-xs font-semibold text-red-400 hover:text-red-300 underline flex items-center"
            >
              Ver faturas
              <ArrowUpRight size={13} className="ml-0.5" />
            </button>
          </div>
          <div className="mt-2 text-xs text-red-400/80">
            Acesso suspenso na catraca até a liquidação
          </div>
        </div>
      </div>

      {/* Main Content: Fast Actions & Real-Time Turnstile Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Turnstile Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-brand-border">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-base font-bold text-white tracking-wide">
                Feed em Tempo Real da Catraca
              </h2>
            </div>
            <button
              onClick={onOpenQuickCheckIn}
              className="text-xs text-brand-gold hover:text-yellow-300 font-semibold flex items-center gap-1 transition-colors"
            >
              Simular Entrada
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* List of checkins */}
          <div className="space-y-3">
            {metrics?.recent_checkins && metrics.recent_checkins.length > 0 ? (
              metrics.recent_checkins.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-brand-card/70 border border-brand-border/60 hover:border-brand-border transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        item.status === 'authorized'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {item.status === 'authorized' ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <XCircle size={20} />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{item.member_name}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-black border border-brand-border text-brand-gold">
                          {item.member_code}
                        </span>
                      </div>
                      <span className="text-xs text-brand-muted">
                        {item.plan_name} • {item.reason || (item.status === 'authorized' ? 'Acesso Liberado' : 'Acesso Negado')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        item.status === 'authorized'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {item.status === 'authorized' ? 'Liberado' : 'Bloqueado'}
                    </span>
                    <div className="text-[10px] text-brand-muted mt-1">
                      {new Date(item.checked_in_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-brand-muted">
                <Clock size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Nenhum check-in registrado nas últimas horas.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Operational Shortcuts */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Ações Rápidas da Recepção
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('members')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-brand-card hover:bg-brand-border/70 border border-brand-border/60 text-white font-medium text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-gold/15 text-brand-gold">
                    <UserPlus size={18} />
                  </div>
                  <span>Nova Matrícula de Aluno</span>
                </div>
                <ArrowUpRight size={16} className="text-brand-muted group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => onNavigate('workouts')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-brand-card hover:bg-brand-border/70 border border-brand-border/60 text-white font-medium text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
                    <Dumbbell size={18} />
                  </div>
                  <span>Montar Ficha de Treino</span>
                </div>
                <ArrowUpRight size={16} className="text-brand-muted group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={() => onNavigate('financial')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-brand-card hover:bg-brand-border/70 border border-brand-border/60 text-white font-medium text-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                    <DollarSign size={18} />
                  </div>
                  <span>Baixa de Mensalidades (PIX)</span>
                </div>
                <ArrowUpRight size={16} className="text-brand-muted group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Academia Banner Visual */}
          <div className="relative rounded-2xl overflow-hidden border border-brand-border p-5 flex flex-col justify-end min-h-[200px]">
            <img
              src="/gym_hero_dark.webp"
              alt="Helmans Gym"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/70 to-transparent" />
            <div className="relative z-10 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-gold">
                Helmans Academy HQ
              </span>
              <h4 className="text-base font-bold text-white">
                Infraestrutura de Musculação & Performance
              </h4>
              <p className="text-xs text-gray-300">
                Padrão profissional para atletas e alunos focados em resultado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
