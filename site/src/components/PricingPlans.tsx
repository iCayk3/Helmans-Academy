import React from 'react';
import { GYM_PLANS, GYM_CONFIG } from '../data/gymData';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/formatters';

interface PricingPlansProps {
  onOpenTrialModal: () => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ onOpenTrialModal }) => {
  const handlePlanSelect = (planName: string) => {
    const message = `Olá! Gostaria de mais informações e garantir minha matrícula no *${planName}* da Helmans Academy.`;
    const url = buildWhatsAppUrl(GYM_CONFIG.whatsappNumber, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="planos" className="py-20 sm:py-28 bg-brand-dark/85 backdrop-blur-sm relative overflow-hidden">
      {/* Background glow behind popular card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold tracking-wider uppercase mb-3">
            Transparência & Custo-Benefício
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display mb-4">
            Escolha o Plano Ideal para sua <span className="text-brand-gold">Evolução</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Sem taxas ocultas. Acesso completo aos melhores equipamentos, área de peso livre e suporte profissional.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {GYM_PLANS.map((plan) => {
            const isVip = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isVip
                    ? 'bg-gradient-to-b from-brand-surface to-brand-card border-2 border-brand-gold shadow-gold-lg lg:-translate-y-2'
                    : 'bg-brand-surface border border-brand-border hover:border-zinc-600'
                }`}
              >
                {/* Popular Pill Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-gold text-black shadow-gold">
                      <Sparkles className="w-3.5 h-3.5" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed min-h-[38px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8 p-4 rounded-2xl bg-brand-dark/80 border border-brand-border/60">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                      Investimento
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-white font-display">
                        {plan.priceMonthly}
                      </span>
                      <span className="text-xs sm:text-sm text-zinc-400 font-medium">
                        {plan.periodLabel}
                      </span>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      O que está incluso:
                    </p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                        <div
                          className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${
                            isVip ? 'bg-brand-gold text-black' : 'bg-brand-gold/20 text-brand-gold'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="pt-4 border-t border-brand-border/60 space-y-3">
                  <button
                    onClick={() => handlePlanSelect(plan.name)}
                    className={`w-full min-h-[50px] py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 ${
                      isVip
                        ? 'bg-brand-gold hover:bg-brand-goldDark text-black shadow-gold'
                        : 'bg-brand-card hover:bg-zinc-800 text-white border border-brand-border'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    Atendimento humanizado e sem burocracia
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free trial guarantee banner */}
        <div className="mt-14 max-w-3xl mx-auto p-6 rounded-2xl bg-brand-surface border border-brand-border text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base font-bold text-white">Ainda está na dúvida de qual escolher?</h4>
            <p className="text-xs text-zinc-400">Faça um treino completo sem pagar nada e sinta a diferença.</p>
          </div>
          <button
            onClick={onOpenTrialModal}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-black bg-brand-gold hover:bg-brand-goldDark transition-all whitespace-nowrap shadow-gold-sm"
          >
            Quero Minha Aula Grátis
          </button>
        </div>
      </div>
    </section>
  );
};
