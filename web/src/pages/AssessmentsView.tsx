import React, { useEffect, useState } from 'react';
import {
  Activity,
  Save,
  CheckCircle2,
  Calendar,
  Loader2,
  User
} from 'lucide-react';
import { api } from '../services/api';
import type { Member, PhysicalAssessment } from '../types';

export const AssessmentsView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [assessments, setAssessments] = useState<PhysicalAssessment[]>([]);

  // New assessment form state
  const [formData, setFormData] = useState({
    weight_kg: 78.5,
    height_cm: 178,
    body_fat_pct: 14.2,
    muscle_mass_kg: 38.0,
    chest_cm: 104,
    waist_cm: 82,
    abdomen_cm: 85,
    hips_cm: 98,
    right_arm_cm: 39,
    left_arm_cm: 38.5,
    right_thigh_cm: 58,
    left_thigh_cm: 58,
    notes: 'Boa simetria muscular e vascularização.',
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchMembers = async () => {
    try {
      const data = await api.get<Member[]>('/members?status=active');
      setMembers(data);
      if (data.length > 0) {
        setSelectedMemberId(data[0].id);
        fetchAssessments(data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAssessments = async (memberId: string) => {
    try {
      const data = await api.get<PhysicalAssessment[]>(`/assessments/member/${memberId}`);
      setAssessments(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    fetchAssessments(memberId);
  };

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      await api.post('/assessments', {
        ...formData,
        member_id: selectedMemberId,
      });
      setSaveSuccess(true);
      fetchAssessments(selectedMemberId);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Falha ao salvar avaliação física:', e);
    } finally {
      setSaving(false);
    }
  };

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  return (
    <div className="space-y-6">
      {/* Top Selector: Choose Member */}
      <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold border border-brand-gold/30 flex items-center justify-center font-bold">
            <Activity size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Acompanhamento Antropométrico & Composição Corporal
            </h2>
            <p className="text-xs text-brand-muted">
              Selecione o aluno para avaliar ou consultar o histórico de evolução
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <User size={16} className="text-brand-gold" />
          <select
            value={selectedMemberId}
            onChange={(e) => handleSelectMember(e.target.value)}
            className="px-3.5 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs font-semibold focus:border-brand-gold focus:outline-none"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 cols): Register new evaluation */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Lançar Nova Avaliação ({selectedMember?.name || 'Aluno'})
            </h3>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={14} /> Salvo com sucesso!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveAssessment} className="space-y-4">
            {/* Core Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData({ ...formData, weight_kg: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white font-bold text-sm focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.height_cm}
                  onChange={(e) => setFormData({ ...formData, height_cm: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white font-bold text-sm focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Gordura (% BF)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.body_fat_pct}
                  onChange={(e) => setFormData({ ...formData, body_fat_pct: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white font-bold text-sm focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Massa Muscular (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.muscle_mass_kg}
                  onChange={(e) => setFormData({ ...formData, muscle_mass_kg: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white font-bold text-sm focus:border-brand-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Circumferences */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider">
                Perímetros & Dobras (cm)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Tórax / Peitoral</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.chest_cm}
                    onChange={(e) => setFormData({ ...formData, chest_cm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-brand-black border border-brand-border rounded-lg text-white text-xs focus:border-brand-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Cintura</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.waist_cm}
                    onChange={(e) => setFormData({ ...formData, waist_cm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-brand-black border border-brand-border rounded-lg text-white text-xs focus:border-brand-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Braço Direito</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.right_arm_cm}
                    onChange={(e) => setFormData({ ...formData, right_arm_cm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-brand-black border border-brand-border rounded-lg text-white text-xs focus:border-brand-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Coxa Direita</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.right_thigh_cm}
                    onChange={(e) => setFormData({ ...formData, right_thigh_cm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-brand-black border border-brand-border rounded-lg text-white text-xs focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Parecer do Avaliador
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:border-brand-gold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-extrabold text-sm rounded-xl transition-all shadow-gold-sm flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Salvar Registro de Avaliação
            </button>
          </form>
        </div>

        {/* Right Col (5 cols): Historical progression */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Histórico de Evolução
            </h3>
            <span className="text-xs text-brand-muted">{assessments.length} registradas</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {assessments.length > 0 ? (
              assessments.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-gold flex items-center gap-1.5">
                      <Calendar size={13} />
                      {new Date(a.assessed_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {a.body_fat_pct}% BF
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-brand-black border border-brand-border/60">
                      <span className="text-[10px] text-brand-muted">Peso</span>
                      <div className="font-bold text-white">{a.weight_kg} kg</div>
                    </div>
                    <div className="p-2 rounded-lg bg-brand-black border border-brand-border/60">
                      <span className="text-[10px] text-brand-muted">Massa Musc.</span>
                      <div className="font-bold text-white">{a.muscle_mass_kg} kg</div>
                    </div>
                    <div className="p-2 rounded-lg bg-brand-black border border-brand-border/60">
                      <span className="text-[10px] text-brand-muted">Braço D.</span>
                      <div className="font-bold text-white">{a.right_arm_cm} cm</div>
                    </div>
                  </div>

                  {a.notes && (
                    <p className="text-[11px] text-gray-400 italic">
                      "{a.notes}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-brand-muted">
                <Activity size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-xs">Nenhuma avaliação física cadastrada para este aluno ainda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
