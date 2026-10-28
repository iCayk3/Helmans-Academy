import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Loader2,
  Calendar,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import type { Invoice, Plan } from '../types';

export const FinancialView: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [payingId, setPayingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const params = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const [invList, planList] = await Promise.all([
        api.get<Invoice[]>(`/invoices${params}`),
        api.get<Plan[]>('/plans'),
      ]);
      setInvoices(invList);
      setPlans(planList);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const handlePayInvoice = async (invoiceId: string) => {
    setPayingId(invoiceId);
    try {
      await api.post(`/invoices/${invoiceId}/pay`);
      fetchData();
    } catch (e) {
      console.error('Falha ao dar baixa na fatura:', e);
    } finally {
      setPayingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 size={12} />
            Liquidada
          </span>
        );
      case 'overdue':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold">
            <AlertCircle size={12} />
            Vencida
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
            <Clock size={12} />
            Pendente
          </span>
        );
    }
  };

  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border">
          <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
            Faturas Liquidadas
          </span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">
              R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <CheckCircle2 size={20} className="text-emerald-400" />
          </div>
          <p className="mt-1 text-xs text-brand-muted">Entradas confirmadas no caixa</p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border">
          <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
            Total em Atraso (Inadimplência)
          </span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-red-400">
              R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <AlertCircle size={20} className="text-red-400" />
          </div>
          <p className="mt-1 text-xs text-red-400/80">Bloqueio automático na catraca ativo</p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border">
          <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
            Planos Vigentes
          </span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-brand-gold">
              {plans.length} modalidades
            </span>
            <Layers size={20} className="text-brand-gold" />
          </div>
          <p className="mt-1 text-xs text-brand-muted">Standard, Performance, Elite & Black VIP</p>
        </div>
      </div>

      {/* Plans Horizontal Showcase */}
      <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-brand-gold" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Tabela de Planos de Adesão da Academia
            </h3>
          </div>
          <span className="text-xs text-brand-muted">Valores vigentes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-brand-gold uppercase">
                  {p.duration_months === 1 ? '1 Mês' : `${p.duration_months} Meses`}
                </span>
                <h4 className="font-bold text-white text-base mt-1">{p.name}</h4>
                <p className="text-xs text-brand-muted mt-1">{p.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-white">
                  R$ {p.price.toFixed(2)}
                </span>
                <span className="text-[11px] text-brand-muted">
                  {p.duration_months > 1 ? `R$ ${(p.price / p.duration_months).toFixed(2)}/mês` : 'avulso'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices List with 1-Click Pay Action */}
      <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-brand-gold" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Gestão de Mensalidades & Faturas
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center p-1 bg-brand-black border border-brand-border rounded-xl">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'overdue', label: 'Vencidas' },
              { id: 'pending', label: 'Pendentes' },
              { id: 'paid', label: 'Liquidadas' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === f.id
                    ? 'bg-brand-card text-brand-gold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-brand-card text-[11px] font-bold text-brand-muted uppercase border-b border-brand-border">
              <tr>
                <th className="py-3 px-4">Aluno</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-brand-card/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {inv.member_name}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sm text-white">
                    R$ {inv.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-500" />
                      {new Date(inv.due_date).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(inv.status)}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-brand-muted">
                    {inv.payment_method || 'PIX'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {inv.status !== 'paid' ? (
                      <button
                        onClick={() => handlePayInvoice(inv.id)}
                        disabled={payingId === inv.id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        {payingId === inv.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                        Dar Baixa (Liberar Catraca)
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-500 italic">Pago em {new Date(inv.paid_at || '').toLocaleDateString('pt-BR')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
