import React, { useState } from 'react';
import { Calculator, Sparkles, ArrowRight, Flame, Scale, Activity } from 'lucide-react';

interface BmiCalculatorProps {
  onOpenTrialModal: () => void;
}

export const BmiCalculator: React.FC<BmiCalculatorProps> = ({ onOpenTrialModal }) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('28');
  const [weight, setWeight] = useState<string>('75');
  const [height, setHeight] = useState<string>('175');
  const [activityLevel, setActivityLevel] = useState<number>(1.55); // Moderate
  const [goal, setGoal] = useState<'hypertrophy' | 'fatloss' | 'maintenance'>('hypertrophy');

  // Calculations
  const weightNum = parseFloat(weight) || 0;
  const heightNum = parseFloat(height) || 0;
  const ageNum = parseInt(age, 10) || 0;

  let bmi = 0;
  let bmiCategory = '';
  let bmiColor = '';

  if (weightNum > 0 && heightNum > 0) {
    const heightM = heightNum / 100;
    bmi = parseFloat((weightNum / (heightM * heightM)).toFixed(1));

    if (bmi < 18.5) {
      bmiCategory = 'Abaixo do peso ideal';
      bmiColor = 'text-blue-400';
    } else if (bmi < 24.9) {
      bmiCategory = 'Peso normal / Saudável';
      bmiColor = 'text-green-400';
    } else if (bmi < 29.9) {
      bmiCategory = 'Sobrepeso (Atenção à Composição)';
      bmiColor = 'text-amber-400';
    } else {
      bmiCategory = 'Obesidade (Recomendado acompanhamento)';
      bmiColor = 'text-red-400';
    }
  }

  // TMB (Mifflin-St Jeor)
  let bmr = 0;
  if (weightNum > 0 && heightNum > 0 && ageNum > 0) {
    if (gender === 'male') {
      bmr = Math.round(10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5);
    } else {
      bmr = Math.round(10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161);
    }
  }

  const tdee = Math.round(bmr * activityLevel);

  let targetCalories = tdee;
  let goalLabel = 'Manutenção e saúde muscular';
  if (goal === 'hypertrophy') {
    targetCalories = Math.round(tdee + 350);
    goalLabel = 'Superávit Calórico (+350 kcal) para Ganho de Massa';
  } else if (goal === 'fatloss') {
    targetCalories = Math.round(tdee - 450);
    goalLabel = 'Déficit Calórico (-450 kcal) para Queima de Gordura';
  }

  return (
    <section id="calculadora" className="py-20 bg-brand-surface border-y border-brand-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold tracking-wider uppercase mb-3">
            Ferramenta Interativa
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display mb-4">
            Calcule seu <span className="text-brand-gold">IMC & Gasto Calórico</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Descubra suas necessidades energéticas diárias para direcionar seu plano alimentar e treino de musculação com mais precisão.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-7 bg-brand-dark border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2.5">
              <Calculator className="w-5 h-5 text-brand-gold" />
              <span>Informe seus Dados</span>
            </h3>

            {/* Gender Selection */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Sexo Biológico
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`min-h-[44px] py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                    gender === 'male'
                      ? 'bg-brand-gold/10 border-brand-gold text-brand-gold font-bold shadow-gold-sm'
                      : 'bg-brand-surface border-brand-border text-zinc-300 hover:text-white'
                  }`}
                >
                  Masculino
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`min-h-[44px] py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                    gender === 'female'
                      ? 'bg-brand-gold/10 border-brand-gold text-brand-gold font-bold shadow-gold-sm'
                      : 'bg-brand-surface border-brand-border text-zinc-300 hover:text-white'
                  }`}
                >
                  Feminino
                </button>
              </div>
            </div>

            {/* Age, Weight, Height Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Idade (anos)
                </label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full min-h-[44px] bg-brand-surface border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full min-h-[44px] bg-brand-surface border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="230"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Ex: 175"
                  className="w-full min-h-[44px] bg-brand-surface border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Nível de Atividade Física
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
                className="w-full min-h-[44px] bg-brand-surface border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors cursor-pointer"
              >
                <option value={1.2}>Sedentário (pouco ou nenhum exercício)</option>
                <option value={1.375}>Leve (exercício 1 a 3 dias por semana)</option>
                <option value={1.55}>Moderado (musculação 3 a 5 dias por semana)</option>
                <option value={1.725}>Intenso (treino pesado 6 a 7 dias por semana)</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Objetivo Principal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setGoal('hypertrophy')}
                  className={`min-h-[44px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                    goal === 'hypertrophy'
                      ? 'bg-brand-gold/10 border-brand-gold text-brand-gold font-bold shadow-gold-sm'
                      : 'bg-brand-surface border-brand-border text-zinc-300 hover:text-white'
                  }`}
                >
                  Hipertrofia (Ganho)
                </button>
                <button
                  type="button"
                  onClick={() => setGoal('fatloss')}
                  className={`min-h-[44px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                    goal === 'fatloss'
                      ? 'bg-brand-gold/10 border-brand-gold text-brand-gold font-bold shadow-gold-sm'
                      : 'bg-brand-surface border-brand-border text-zinc-300 hover:text-white'
                  }`}
                >
                  Queima de Gordura
                </button>
                <button
                  type="button"
                  onClick={() => setGoal('maintenance')}
                  className={`min-h-[44px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                    goal === 'maintenance'
                      ? 'bg-brand-gold/10 border-brand-gold text-brand-gold font-bold shadow-gold-sm'
                      : 'bg-brand-surface border-brand-border text-zinc-300 hover:text-white'
                  }`}
                >
                  Manutenção & Força
                </button>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-brand-dark to-brand-surface border border-brand-gold/30 rounded-2xl p-6 sm:p-8 shadow-gold-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
                  Diagnóstico Estimado
                </span>
                <Sparkles className="w-5 h-5 text-brand-gold" />
              </div>

              {/* BMI Card */}
              <div className="p-4 rounded-xl bg-brand-card/90 border border-brand-border mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-brand-gold" />
                    Seu Índice de Massa Corporal (IMC)
                  </span>
                  <span className="text-2xl font-black text-white font-display">
                    {bmi > 0 ? bmi : '--'}
                  </span>
                </div>
                <p className={`text-xs font-bold ${bmiColor}`}>
                  {bmiCategory || 'Preencha os campos para calcular'}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  *Nota: O IMC é um indicador geral. Atletas com boa massa muscular necessitam de avaliação de bioimpedância para verificar a gordura real.
                </p>
              </div>

              {/* Calories Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="p-3.5 rounded-xl bg-brand-card/70 border border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs text-zinc-300">Taxa Metabólica Basal (TMB):</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {bmr > 0 ? `${bmr} kcal` : '--'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-brand-card/70 border border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-zinc-300">Gasto Calórico Diário (TDEE):</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {tdee > 0 ? `${tdee} kcal` : '--'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-brand-gold/10 border border-brand-gold/30">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-gold block mb-1">
                    Meta Calórica Sugerida:
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-display">
                      {targetCalories > 0 ? targetCalories : '--'}
                    </span>
                    <span className="text-xs text-zinc-300 font-semibold">kcal/dia</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{goalLabel}</p>
                </div>
              </div>
            </div>

            {/* Direct Conversion Hook */}
            <div className="pt-4 border-t border-brand-border">
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                Quer saber sua porcentagem exata de gordura corporal, massa magra e retenção hídrica?
              </p>
              <button
                onClick={onOpenTrialModal}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl font-bold text-black bg-brand-gold hover:bg-brand-goldDark shadow-gold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
              >
                <span>Agendar Avaliação Física Gratuita</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
