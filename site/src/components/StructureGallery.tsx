import React, { useState } from 'react';
import { Dumbbell, Shield, Wind, Sparkles, ChevronRight } from 'lucide-react';

interface StructureGalleryProps {
  onOpenTrialModal: () => void;
}

export const StructureGallery: React.FC<StructureGalleryProps> = ({ onOpenTrialModal }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pesos' | 'maquinas' | 'conforto'>('all');

  const facilities = [
    {
      id: 'f1',
      title: 'Rack de Halteres de Alta Carga',
      category: 'pesos',
      categoryLabel: 'Peso Livre',
      desc: 'Pares completos de halteres monobloco emborrachados variando de 1kg até pesos acima de 50kg, com suporte duplo reforçado.',
      image: '/images/academia-pesos-livres.webp',
      badge: 'Destaque Peso Livre',
    },
    {
      id: 'f2',
      title: 'Máquinas Biomecânicas Articuladas',
      category: 'maquinas',
      categoryLabel: 'Maquinário',
      desc: 'Linha completa convergente e divergente com alavancas independentes para estímulo muscular simétrico e isolamento preciso.',
      image: '/images/academia-pesos-livres.webp',
      badge: 'Linha Pro',
    },
    {
      id: 'f3',
      title: 'Piso Técnico & Amortecimento',
      category: 'conforto',
      categoryLabel: 'Conforto & Segurança',
      desc: 'Área com piso de borracha vulcanizada de alta densidade (15mm) para absorção de impacto, aderência antiderrapante e isolamento acústico.',
      image: '/images/academia-pesos-livres.webp',
      badge: 'Segurança',
    },
  ];

  const filtered = activeTab === 'all' ? facilities : facilities.filter((f) => f.category === activeTab);

  return (
    <section id="estrutura" className="py-20 bg-brand-surface border-y border-brand-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold tracking-wider uppercase mb-3">
            Espaço & Equipamentos
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display mb-4">
            Estrutura Completa de <span className="text-brand-gold">Primeira Linha</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Cada detalhe do salão foi projetado para elevar a intensidade do seu treino com o máximo de conforto, segurança e eficiência mecânica.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          <button
            onClick={() => setActiveTab('all')}
            className={`min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-brand-gold text-black shadow-gold font-bold'
                : 'bg-brand-dark text-zinc-300 hover:text-white border border-brand-border'
            }`}
          >
            Todos os Espaços
          </button>
          <button
            onClick={() => setActiveTab('pesos')}
            className={`min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'pesos'
                ? 'bg-brand-gold text-black shadow-gold font-bold'
                : 'bg-brand-dark text-zinc-300 hover:text-white border border-brand-border'
            }`}
          >
            Área de Peso Livre
          </button>
          <button
            onClick={() => setActiveTab('maquinas')}
            className={`min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'maquinas'
                ? 'bg-brand-gold text-black shadow-gold font-bold'
                : 'bg-brand-dark text-zinc-300 hover:text-white border border-brand-border'
            }`}
          >
            Maquinário Articulado
          </button>
          <button
            onClick={() => setActiveTab('conforto')}
            className={`min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'conforto'
                ? 'bg-brand-gold text-black shadow-gold font-bold'
                : 'bg-brand-dark text-zinc-300 hover:text-white border border-brand-border'
            }`}
          >
            Segurança & Conforto
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-brand-dark border border-brand-border hover:border-brand-gold/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group shadow-card"
            >
              {/* Image Container with fixed aspect ratio (CLS = 0) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-surface">
                <img
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-dark/90 backdrop-blur-md text-[11px] font-bold text-brand-gold border border-brand-gold/30">
                  {item.badge}
                </span>
              </div>

              {/* Text Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    {item.categoryLabel}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2 group-hover:text-brand-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
                  <span className="text-xs text-zinc-300 flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                    Alta Durabilidade
                  </span>
                  <button
                    onClick={onOpenTrialModal}
                    className="text-xs font-bold text-brand-gold hover:text-white flex items-center gap-1 transition-colors"
                  >
                    Ver de perto <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-brand-dark border border-brand-border text-center">
          <div className="flex flex-col items-center p-3">
            <Wind className="w-6 h-6 text-brand-gold mb-2" />
            <h4 className="text-sm font-bold text-white">100% Climatizado</h4>
            <p className="text-xs text-zinc-400 mt-1">Ar condicionado central em todo o salão de treino.</p>
          </div>
          <div className="flex flex-col items-center p-3 sm:border-x sm:border-brand-border">
            <Dumbbell className="w-6 h-6 text-brand-gold mb-2" />
            <h4 className="text-sm font-bold text-white">Sem Fila para Treinar</h4>
            <p className="text-xs text-zinc-400 mt-1">Variedade de estações para ninguém perder o aquecimento.</p>
          </div>
          <div className="flex flex-col items-center p-3">
            <Shield className="w-6 h-6 text-brand-gold mb-2" />
            <h4 className="text-sm font-bold text-white">Vestiários Completos</h4>
            <p className="text-xs text-zinc-400 mt-1">Duchas aquecidas, armários rotativos e bancadas amplas.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
