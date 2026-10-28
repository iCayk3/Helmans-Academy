import React, { useEffect, useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import type { CheckIn } from '../types';

export const CheckinView: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestCheckIn, setLatestCheckIn] = useState<CheckIn | null>(null);
  const [recentList, setRecentList] = useState<CheckIn[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchRecent = async () => {
    try {
      const data = await api.get<CheckIn[]>('/checkin/recent');
      setRecentList(data);
      if (data.length > 0 && !latestCheckIn) {
        setLatestCheckIn(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.post<CheckIn>('/checkin', { identifier: identifier.trim() });
      setLatestCheckIn(res);
      setIdentifier('');
      fetchRecent();
    } catch (err: any) {
      setErrorMessage(err.message || 'Aluno não localizado ou erro no leitor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Reception Kiosk Header */}
      <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 text-brand-gold border border-brand-gold/30 flex items-center justify-center shrink-0">
            <QrCode size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Terminal da Catraca</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                Online
              </span>
            </div>
            <p className="text-xs text-brand-muted">
              Leitor biométrico / código de barras / matrícula digital ativo
            </p>
          </div>
        </div>

        {/* Big Clock */}
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
            {currentTime.toLocaleTimeString('pt-BR')}
          </div>
          <div className="text-xs text-brand-gold font-medium uppercase tracking-wider">
            {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Fast Entry Terminal Form & Visual Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Input Box */}
          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
              Identificação do Aluno
            </span>

            <form onSubmit={handleCheckInSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Passe a biometria ou digite a matrícula..."
                  autoFocus
                  className="w-full px-4 py-3.5 bg-brand-black border-2 border-brand-border rounded-xl text-white placeholder-gray-500 text-base font-semibold focus:outline-none focus:border-brand-gold transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !identifier.trim()}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-extrabold rounded-lg flex items-center transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                </button>
              </div>

              <div className="flex gap-2">
                {['HA-1001', 'HA-1002', 'HA-1003', 'HA-1004'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setIdentifier(code)}
                    className="flex-1 py-1.5 rounded-lg bg-brand-card hover:bg-brand-border text-[11px] font-mono text-gray-300 hover:text-white border border-brand-border/60 transition-colors"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </form>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Big Visual Turnstile Screen */}
          {latestCheckIn && (
            <div
              className={`p-6 rounded-2xl border text-center space-y-4 transition-all animate-in fade-in ${
                latestCheckIn.status === 'authorized'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]'
                  : 'bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)]'
              }`}
            >
              <div className="flex justify-center">
                {latestCheckIn.status === 'authorized' ? (
                  <CheckCircle2 size={64} className="text-emerald-400" />
                ) : (
                  <XCircle size={64} className="text-red-400" />
                )}
              </div>

              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase">
                  {latestCheckIn.member_code}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {latestCheckIn.member_name}
                </h3>
                <p className="text-sm font-semibold mt-1">
                  {latestCheckIn.reason || (latestCheckIn.status === 'authorized' ? 'Bom Treino!' : 'Acesso Negado')}
                </p>
              </div>

              <div className="inline-block px-4 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-semibold text-gray-300">
                Plano: <span className="text-brand-gold">{latestCheckIn.plan_name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (7 Cols): Today's Check-in Log */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-brand-gold" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Histórico Recente de Entradas
              </h3>
            </div>
            <span className="text-xs text-brand-muted">
              {recentList.length} registros listados
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {recentList.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-brand-card/70 border border-brand-border/60"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      c.status === 'authorized'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {c.status === 'authorized' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{c.member_name}</span>
                      <span className="text-[10px] font-mono text-brand-gold px-1.5 py-0.5 rounded bg-brand-black">
                        {c.member_code}
                      </span>
                    </div>
                    <span className="text-xs text-brand-muted">
                      {c.plan_name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      c.status === 'authorized'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {c.status === 'authorized' ? 'Liberado' : 'Barrado'}
                  </span>
                  <div className="text-[10px] text-gray-500 mt-1">
                    {new Date(c.checked_in_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
