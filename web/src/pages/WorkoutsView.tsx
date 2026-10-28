import React, { useEffect, useState } from 'react';
import {
  Dumbbell,
  Trash2,
  Save,
  CheckCircle2,
  Layers,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import type { Exercise, Member } from '../types';

export const WorkoutsView: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');

  // New Workout Prescription Form State
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [workoutTitle, setWorkoutTitle] = useState('Hipertrofia ABC - Carga Progressiva');
  const [workoutGoal, setWorkoutGoal] = useState('Hipertrofia');
  const [workoutLevel] = useState('Intermediário');
  const [workoutItems, setWorkoutItems] = useState<
    Array<{
      division: string;
      exercise_id: string;
      sets: number;
      reps: string;
      weight_kg: number;
      rest_seconds: number;
      notes: string;
    }>
  >([]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const muscleGroups = ['all', 'Peito', 'Costas', 'Quadríceps', 'Ombros', 'Bíceps', 'Tríceps'];

  const fetchData = async () => {
    try {
      const [exList, memList] = await Promise.all([
        api.get<Exercise[]>('/exercises'),
        api.get<Member[]>('/members?status=active'),
      ]);
      setExercises(exList);
      setMembers(memList);
      if (memList.length > 0 && !selectedMemberId) {
        setSelectedMemberId(memList[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExerciseToWorkout = (exercise: Exercise, division: string = 'A') => {
    setWorkoutItems((prev) => [
      ...prev,
      {
        division,
        exercise_id: exercise.id,
        sets: 3,
        reps: '8-12',
        weight_kg: 20,
        rest_seconds: 60,
        notes: exercise.name,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setWorkoutItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveWorkout = async () => {
    if (!selectedMemberId || workoutItems.length === 0) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      await api.post('/workouts', {
        member_id: selectedMemberId,
        title: workoutTitle,
        goal: workoutGoal,
        level: workoutLevel,
        items: workoutItems.map((item, idx) => ({
          ...item,
          order_index: idx,
        })),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e) {
      console.error('Falha ao salvar ficha de treino:', e);
    } finally {
      setSaving(false);
    }
  };

  const filteredExercises =
    selectedMuscle === 'all'
      ? exercises
      : exercises.filter((e) => e.muscle_group.toLowerCase() === selectedMuscle.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (5 cols): Exercises Library Explorer */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <Dumbbell size={20} className="text-brand-gold" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Biblioteca de Exercícios
              </h2>
            </div>
            <span className="text-xs text-brand-muted">{filteredExercises.length} exercícios</span>
          </div>

          {/* Muscle Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {muscleGroups.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMuscle(m)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedMuscle === m
                    ? 'bg-brand-gold text-brand-black shadow-gold-sm'
                    : 'bg-brand-card text-gray-400 hover:text-white border border-brand-border/60'
                }`}
              >
                {m === 'all' ? 'Todos' : m}
              </button>
            ))}
          </div>

          {/* Exercise Items List */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                className="p-3 rounded-xl bg-brand-card/80 border border-brand-border/60 hover:border-brand-gold/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-brand-gold transition-colors">
                    {ex.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-brand-muted">
                    <span className="px-2 py-0.5 rounded bg-brand-black border border-brand-border text-brand-gold text-[10px] font-semibold">
                      {ex.muscle_group}
                    </span>
                    <span>{ex.equipment || 'Livre'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {['A', 'B', 'C'].map((div) => (
                    <button
                      key={div}
                      onClick={() => handleAddExerciseToWorkout(ex, div)}
                      className="px-2.5 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-gold hover:text-brand-black text-brand-gold text-xs font-bold border border-brand-border/80 transition-colors"
                      title={`Adicionar ao Treino ${div}`}
                    >
                      +{div}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col (7 cols): Workout Prescription Sheet Builder */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-brand-surface border border-brand-border space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <Layers size={20} className="text-brand-gold" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Prescrição de Treino Ativa
              </h2>
            </div>

            <button
              onClick={handleSaveWorkout}
              disabled={saving || workoutItems.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold text-xs sm:text-sm tracking-wide transition-all shadow-gold-sm disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Salvar Ficha
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} />
              <span>Ficha de treino salva com sucesso no perfil do aluno!</span>
            </div>
          )}

          {/* Form Header: Member, Title, Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                Aluno Destinatário
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs font-semibold focus:border-brand-gold focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                Título do Treino
              </label>
              <input
                type="text"
                value={workoutTitle}
                onChange={(e) => setWorkoutTitle(e.target.value)}
                className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                Objetivo
              </label>
              <select
                value={workoutGoal}
                onChange={(e) => setWorkoutGoal(e.target.value)}
                className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:border-brand-gold focus:outline-none"
              >
                <option value="Hipertrofia">Hipertrofia Muscular</option>
                <option value="Emagrecimento">Definição / Emagrecimento</option>
                <option value="Força Pura">Força Máxima / Powerlifting</option>
                <option value="Condicionamento">Condicionamento Físico</option>
              </select>
            </div>
          </div>

          {/* Items in the Prescription */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-brand-muted">
              <span>Exercícios na Ficha ({workoutItems.length})</span>
              <span>Clique em +A, +B ou +C na lista à esquerda para adicionar</span>
            </div>

            {workoutItems.length > 0 ? (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {workoutItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-brand-card border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-brand-gold/15 text-brand-gold border border-brand-gold/30 flex items-center justify-center font-extrabold text-xs shrink-0">
                        {item.division}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{item.notes}</h4>
                        <span className="text-[11px] text-brand-muted">Divisão {item.division}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-brand-black px-2 py-1 rounded-lg border border-brand-border">
                        <span className="text-[10px] text-gray-400">Séries:</span>
                        <input
                          type="number"
                          value={item.sets}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setWorkoutItems((prev) =>
                              prev.map((it, i) => (i === index ? { ...it, sets: val } : it))
                            );
                          }}
                          className="w-10 bg-transparent text-center text-xs font-bold text-white focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1 bg-brand-black px-2 py-1 rounded-lg border border-brand-border">
                        <span className="text-[10px] text-gray-400">Reps:</span>
                        <input
                          type="text"
                          value={item.reps}
                          onChange={(e) => {
                            const val = e.target.value;
                            setWorkoutItems((prev) =>
                              prev.map((it, i) => (i === index ? { ...it, reps: val } : it))
                            );
                          }}
                          className="w-14 bg-transparent text-center text-xs font-bold text-white focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1 bg-brand-black px-2 py-1 rounded-lg border border-brand-border">
                        <span className="text-[10px] text-gray-400">Kg:</span>
                        <input
                          type="number"
                          value={item.weight_kg}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setWorkoutItems((prev) =>
                              prev.map((it, i) => (i === index ? { ...it, weight_kg: val } : it))
                            );
                          }}
                          className="w-12 bg-transparent text-center text-xs font-bold text-white focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remover exercício"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-brand-card/50 border border-dashed border-brand-border space-y-2">
                <Dumbbell size={32} className="mx-auto text-brand-muted opacity-40" />
                <p className="text-xs text-brand-muted">
                  Nenhum exercício adicionado a esta ficha ainda. Selecione os exercícios na coluna à esquerda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
