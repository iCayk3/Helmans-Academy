import React from 'react';
import { ArrowRight, ShieldCheck, Flame, Dumbbell, Award, ChevronDown } from 'lucide-react';
import { GYM_CONFIG } from '../data/gymData';
import RisingLines from './RisingLines';

interface HeroProps {
  onOpenTrialModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTrialModal }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-brand-dark">
      {/* Rising Lines Background Canvas (Originkit) */}
      <div className="absolute inset-0 z-0">
        <RisingLines
          color="#FACC15"
          horizonColor="#EAB308"
          particles={120}
          riseSpeed={22}
          opacity={90}
          scale={6}
          showHorizon={true}
          horizonOpacity={80}
        />
        {/* Subtle texture overlay of real gym weights */}
        <img
          src="./images/academia-pesos-livres.webp"
          alt="Estrutura de musculação e pesos livres da Helmans Academy"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-10 mix-blend-luminosity pointer-events-none"
          loading="eager"
          decoding="async"
        />
        {/* Gradient edge blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/40 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Authority Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-surface/90 border border-brand-gold/30 shadow-gold-sm mb-6 animate-pulse">
          <Award className="w-4 h-4 text-brand-gold" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-200">
            A academia referência em <strong className="text-brand-gold font-bold">Musculação & Biomecânica</strong>
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight font-display max-w-4xl leading-[1.1] mb-6">
          Construa sua melhor versão com{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-brand-gold to-amber-500">
            Força & Biomecânica
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mb-10 leading-relaxed font-normal">
          Chega de filas e aparelhos fracos. Na <span className="text-white font-semibold">{GYM_CONFIG.name}</span> você encontra maquinário profissional de alta carga, rack de halteres completo e acompanhamento sério para acelerar seus resultados.
        </p>

        {/* CTAs */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onOpenTrialModal}
            className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-xl font-bold text-black bg-brand-gold hover:bg-brand-goldDark shadow-gold hover:shadow-gold-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-base group"
          >
            <span>Agendar Aula Grátis</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#planos"
            className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-xl font-semibold text-white bg-brand-surface hover:bg-brand-card border border-brand-border hover:border-zinc-500 transition-all flex items-center justify-center gap-2 text-base"
          >
            <span>Conhecer os Planos</span>
          </a>
        </div>

        {/* Pillars / Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-4xl text-left">
          <div className="p-3 sm:p-4 rounded-xl bg-brand-surface/70 border border-brand-border/60 flex items-center gap-3 backdrop-blur-md">
            <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Peso Livre Farto</p>
              <p className="text-[11px] text-zinc-400">Até 50kg+ em halteres</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-brand-surface/70 border border-brand-border/60 flex items-center gap-3 backdrop-blur-md">
            <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Biomecânica</p>
              <p className="text-[11px] text-zinc-400">Segurança articular total</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-brand-surface/70 border border-brand-border/60 flex items-center gap-3 backdrop-blur-md">
            <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Climatizado</p>
              <p className="text-[11px] text-zinc-400">Conforto térmico 100%</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-brand-surface/70 border border-brand-border/60 flex items-center gap-3 backdrop-blur-md">
            <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Instrutores</p>
              <p className="text-[11px] text-zinc-400">Apoio no salão sem custos</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 hidden lg:flex flex-col items-center animate-bounce">
          <a href="#sobre" aria-label="Rolar para a seção sobre nós">
            <ChevronDown className="w-6 h-6 text-zinc-500 hover:text-brand-gold transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
};
