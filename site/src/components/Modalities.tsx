import React from 'react';
import { GYM_MODALITIES } from '../data/gymData';
import { Dumbbell, Flame, Zap, Activity, CheckCircle, ArrowRight } from 'lucide-react';

interface ModalitiesProps {
  onOpenTrialModal: () => void;
}

export const Modalities: React.FC<ModalitiesProps> = ({ onOpenTrialModal }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Dumbbell':
        return Dumbbell;
      case 'Flame':
        return Flame;
      case 'Zap':
        return Zap;
      case 'Activity':
      default:
        return Activity;
    }
  };

  return (
    <section id="modalidades" className="py-20 bg-brand-dark/85 backdrop-blur-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold tracking-wider uppercase mb-3">
            Treinos & Programas
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display mb-4">
            Modalidades para Cada <span className="text-brand-gold">Objetivo</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Treinamento baseado em evidências científicas, sobrecarga progressiva e biomecânica para você alcançar sua melhor forma com segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GYM_MODALITIES.map((modality) => {
            const IconComp = getIcon(modality.iconName);
            return (
              <div
                key={modality.id}
                className="bg-brand-surface border border-brand-border hover:border-brand-gold/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-card flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold tracking-wider uppercase text-zinc-400 bg-brand-card px-3 py-1 rounded-full border border-brand-border">
                      {modality.category}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">
                    {modality.title}
                  </h3>

                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                    {modality.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Diferenciais inclusos:
                    </p>
                    {modality.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-brand-gold flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                  <button
                    onClick={onOpenTrialModal}
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand-gold hover:text-white transition-colors py-2 focus:outline-none"
                  >
                    <span>Experimentar na Prática</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
