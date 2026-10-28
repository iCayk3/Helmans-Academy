import React, { useState } from 'react';
import { GYM_TESTIMONIALS, GYM_FAQS } from '../data/gymData';
import { Star, Quote, ChevronDown, HelpCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="depoimentos" className="py-20 sm:py-28 bg-brand-dark/85 backdrop-blur-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold tracking-wider uppercase mb-3">
            Resultados Comprovados
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display mb-4">
            Quem Treina na Helmans <span className="text-brand-gold">Recomenda</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Veja o que dizem nossos alunos que transformaram sua saúde, estética e qualidade de vida.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {GYM_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-brand-gold/40 transition-all hover:shadow-card group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-zinc-600 group-hover:text-brand-gold transition-colors" />
                </div>

                <p className="text-sm font-bold text-white mb-2 italic">
                  "{t.highlight}"
                </p>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                  {t.content}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold text-sm">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-brand-gold font-semibold">{t.timeAsMember}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-brand-gold" />
              Tire suas dúvidas
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Perguntas Frequentes
            </h3>
          </div>

          <div className="space-y-3">
            {GYM_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-brand-border bg-brand-surface overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full min-h-[50px] px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-brand-gold transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-brand-border/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
