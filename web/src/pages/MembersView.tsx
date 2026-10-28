import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import type { Member, Plan } from '../types';

export const MembersView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birth_date: '',
    gender: 'Masculino',
    address: '',
    plan_id: '',
    notes: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('q', search.trim());
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const data = await api.get<Member[]>(`/members?${params.toString()}`);
      setMembers(data);
    } catch (err) {
      console.error('Falha ao carregar alunos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const data = await api.get<Plan[]>('/plans');
      setPlans(data);
      if (data.length > 0 && !formData.plan_id) {
        setFormData((prev) => ({ ...prev, plan_id: data[0].id }));
      }
    } catch (err) {
      console.error('Falha ao carregar planos:', err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, filterStatus]);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      await api.post('/members', formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        birth_date: '',
        gender: 'Masculino',
        address: '',
        plan_id: plans[0]?.id || '',
        notes: '',
      });
      fetchMembers();
    } catch (err: any) {
      setFormError(err.message || 'Erro ao matricular aluno.');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 size={13} />
            Ativo
          </span>
        );
      case 'overdue':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold">
            <AlertCircle size={13} />
            Inadimplente
          </span>
        );
      case 'locked':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
            Trancado
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/15 border border-gray-500/30 text-gray-400 text-xs font-semibold">
            <XCircle size={13} />
            Inativo
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Filters & Action Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, matrícula, CPF..."
            className="w-full pl-10 pr-4 py-2.5 bg-brand-surface border border-brand-border rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
          />
        </div>

        {/* Status Filters & New Member CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-brand-surface border border-brand-border rounded-xl">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'active', label: 'Ativos' },
              { id: 'overdue', label: 'Inadimplentes' },
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold text-sm tracking-wide transition-all shadow-gold-sm hover:scale-[1.02] shrink-0"
            style={{ minHeight: '44px' }}
          >
            <UserPlus size={18} />
            <span>Matricular Aluno</span>
          </button>
        </div>
      </div>

      {/* Members Grid / Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-brand-surface rounded-2xl border border-brand-border" />
          ))}
        </div>
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="p-5 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-gold/50 cursor-pointer transition-all duration-200 group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-brand-card border border-brand-border flex items-center justify-center font-bold text-brand-gold text-base shrink-0 group-hover:scale-105 transition-transform">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-brand-gold transition-colors line-clamp-1">
                        {member.name}
                      </h3>
                      <span className="text-xs font-mono text-brand-gold">
                        {member.code}
                      </span>
                    </div>
                  </div>

                  {getStatusBadge(member.status)}
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-brand-muted">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="shrink-0 text-gray-500" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="shrink-0 text-gray-500" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="shrink-0 text-gray-500" />
                    <span>CPF: {member.cpf}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs text-gray-400">
                <span>{member.notes || 'Matrícula regular'}</span>
                <span className="text-brand-gold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  Detalhes <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-brand-surface rounded-2xl border border-brand-border space-y-3">
          <Users size={48} className="mx-auto text-brand-muted opacity-40" />
          <h3 className="text-base font-bold text-white">Nenhum aluno localizado</h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            Não encontramos alunos correspondentes à busca. Tente outro termo ou faça uma nova matrícula.
          </p>
        </div>
      )}

      {/* New Member Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border bg-brand-card/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-gold/15 text-brand-gold">
                  <UserPlus size={20} />
                </div>
                <h2 className="text-base font-bold text-white">Nova Matrícula de Aluno</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Gabriel Santos..."
                    className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aluno@email.com"
                    className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 90000-0000"
                    className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                    Plano de Adesão
                  </label>
                  <select
                    value={formData.plan_id}
                    onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:border-brand-gold focus:outline-none"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - R$ {p.price.toFixed(2)} ({p.duration_months} meses)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                  Observações / Objetivo do Aluno
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Foco em hipertrofia, sem restrições articulares..."
                  className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-gray-300 text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-black text-sm font-bold tracking-wide transition-all shadow-gold-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {formLoading && <Loader2 size={16} className="animate-spin" />}
                  Confirmar Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Details Drawer */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-brand-surface border-l border-brand-border h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 text-brand-gold border border-brand-gold/30 flex items-center justify-center font-extrabold text-lg">
                    {selectedMember.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedMember.name}</h2>
                    <span className="text-xs font-mono text-brand-gold">{selectedMember.code}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-brand-card border border-brand-border/60 space-y-2">
                  <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                    Status de Acesso na Catraca
                  </span>
                  <div>{getStatusBadge(selectedMember.status)}</div>
                </div>

                <div className="p-4 rounded-xl bg-brand-card border border-brand-border/60 space-y-3 text-xs">
                  <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                    Dados Cadastrais
                  </span>
                  <div><span className="text-gray-400">CPF:</span> <strong className="text-white">{selectedMember.cpf}</strong></div>
                  <div><span className="text-gray-400">E-mail:</span> <strong className="text-white">{selectedMember.email}</strong></div>
                  <div><span className="text-gray-400">Telefone:</span> <strong className="text-white">{selectedMember.phone}</strong></div>
                  <div><span className="text-gray-400">Matriculado em:</span> <strong className="text-white">{new Date(selectedMember.created_at).toLocaleDateString('pt-BR')}</strong></div>
                </div>

                <div className="p-4 rounded-xl bg-brand-card border border-brand-border/60 space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                    Notas & Anamnese
                  </span>
                  <p className="text-gray-300 italic">{selectedMember.notes || 'Sem observações especiais registradas.'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedMember(null)}
              className="w-full py-3 bg-brand-card hover:bg-brand-border text-white text-sm font-semibold rounded-xl transition-colors mt-6"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
