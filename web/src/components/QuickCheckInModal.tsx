import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, XCircle, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { api, ApiError } from '../services/api';
import type { CheckIn } from '../types';

interface QuickCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckIn | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const res = await api.post<CheckIn>('/checkin', { identifier: identifier.trim() });
      setResult(res);
      onSuccess();
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 403) {
        // Acesso negado pela catraca, mas a API retorna dados do check-in bloqueado
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err.message || 'Falha ao consultar catraca.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIdentifier('');
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border bg-brand-card/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
              <QrCode size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Simulador de Catraca / Check-in</h2>
              <p className="text-xs text-brand-muted">Digite o código da matrícula, CPF ou nome do aluno</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-brand-border rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!result && !errorMessage ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Matrícula ou CPF
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ex: HA-1001, HA-1002 ou CPF..."
                    autoFocus
                    className="w-full px-4 py-3.5 bg-brand-black border border-brand-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all text-base"
                  />
                  <button
                    type="submit"
                    disabled={loading || !identifier.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  </button>
                </div>
              </div>

              {/* Quick shortcut tags */}
              <div className="pt-2">
                <span className="text-[11px] text-brand-muted uppercase font-semibold">Alunos de Teste Rápido:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIdentifier('HA-1001')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-border border border-brand-border/60 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    HA-1001 (Lucas - Ativo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdentifier('HA-1004')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-border border border-brand-border/60 text-red-400 hover:text-red-300 transition-colors"
                  >
                    HA-1004 (Camila - Vencida)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdentifier('HA-1003')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-border border border-brand-border/60 text-brand-gold hover:text-yellow-300 transition-colors"
                  >
                    HA-1003 (Rodrigo - VIP)
                  </button>
                </div>
              </div>
            </form>
          ) : result ? (
            <div className="space-y-4">
              <div
                className={`p-5 rounded-2xl border text-center space-y-3 ${
                  result.status === 'authorized'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/40 text-red-400'
                }`}
              >
                <div className="flex justify-center">
                  {result.status === 'authorized' ? (
                    <CheckCircle2 size={56} className="text-emerald-400 animate-bounce" />
                  ) : (
                    <XCircle size={56} className="text-red-400" />
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold tracking-wide uppercase">
                    {result.status === 'authorized' ? 'ACESSO LIBERADO' : 'ACESSO BLOQUEADO'}
                  </h3>
                  <p className="text-sm font-medium mt-1 text-gray-200">
                    {result.reason || 'Status processado pela catraca.'}
                  </p>
                </div>

                <div className="py-2 px-4 rounded-xl bg-black/40 border border-white/5 inline-block text-xs text-left space-y-1">
                  <div><span className="text-brand-muted">Aluno:</span> <strong className="text-white">{result.member_name}</strong></div>
                  <div><span className="text-brand-muted">Matrícula:</span> <span className="text-brand-gold font-mono">{result.member_code}</span></div>
                  <div><span className="text-brand-muted">Plano:</span> <span className="text-white">{result.plan_name}</span></div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-brand-card hover:bg-brand-border text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Realizar Novo Check-in
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/40 text-center space-y-2">
                <AlertTriangle size={48} className="text-red-400 mx-auto" />
                <h3 className="text-lg font-bold text-red-400">Falha na Identificação</h3>
                <p className="text-sm text-gray-300">{errorMessage}</p>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-brand-card hover:bg-brand-border text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Tentar Novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
