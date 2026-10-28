import React from 'react';
import { CheckCircle2, Shield, Target, Users2, Sparkles } from 'lucide-react';

interface AboutProps {
  onOpenTrialModal: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenTrialModal }) => {
  const differentials = [
    {
      title: 'Biomecânica de Precisão',
      desc: 'Maquinário projetado para acompanhar a curva de força natural dos músculos, maximizando o estímulo e blindando suas articulações contra lesões.',
      icon: Target,
    },
    {
      title: 'Ambiente de Foco & Motivação',
      desc: 'Aqui todo mundo treina de verdade. Zero frescura, som na medida certa, pesos sempre no lugar e clima de respeito mútuo.',
      icon: Users2,
    },
    {
      title: 'Instrutores Presentes no Salão',
      desc: 'Equipe de profissionais que não fica mexendo no celular: orientamos sua postura, ajudamos no ajuste de cargas e corrigimos a técnica.',
      icon: Shield,
    },
  ];

  return (
    <section id="sobre" className="py-20 sm:py-28 bg-brand-dark/85 backdrop-blur-sm relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Frame & Badges */}
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-brand-border shadow-2xl group">
              <img
                src="./images/academia-pesos-livres.webp"
                alt="Estrutura de musculação da Helmans Academy"
                width={889}
                height={896}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-brand-surface/90 backdrop-blur-md border border-brand-gold/30 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-gold flex items-center justify-center text-black font-bold flex-shrink-0 shadow-gold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Estrutura Pesada
                  </h4>
                  <p className="text-xs text-zinc-300">
                    Halteres monobloco, barras olímpicas oficiais e piso de alta absorção.
                  </p>
                </div>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Right Column: Text & Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold tracking-wider uppercase mb-4">
              Nossa Filosofia
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display mb-6 leading-tight">
              Musculação de verdade para quem busca{' '}
              <span className="text-brand-gold">Resultados Reais</span>
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg mb-6 leading-relaxed">
              A <strong className="text-white">Helmans Academy</strong> nasceu com um propósito claro: resgatar a essência do treinamento de força aliado à mais alta tecnologia biomecânica.
            </p>

            <p className="text-zinc-400 text-sm sm:text-base mb-8 leading-relaxed">
              Seja para hipertrofia máxima, queima de gordura acelerada, reabilitação ou saúde duradoura, criamos um espaço onde você não perde tempo em filas e tem à disposição os melhores recursos para atingir o seu ápice físico.
            </p>

            {/* Differentials List */}
            <div className="space-y-4 mb-8">
              {differentials.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-brand-surface/50 border border-brand-border/60 hover:border-brand-gold/40 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold mt-0.5 flex-shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <button
              onClick={onOpenTrialModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black bg-brand-gold hover:bg-brand-goldDark shadow-gold transition-all transform hover:-translate-y-0.5"
            >
              <span>Venha Treinar Conosco</span>
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
