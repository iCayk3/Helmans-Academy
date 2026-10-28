import React from 'react';
import { MapPin, Phone, MessageSquare, Navigation, ExternalLink } from 'lucide-react';
import { GYM_CONFIG } from '../data/gymData';
import { buildWhatsAppUrl } from '../utils/formatters';

export const LocationContact: React.FC = () => {
  const handleWhatsAppContact = () => {
    const message = "Olá! Gostaria de tirar dúvidas sobre a Helmans Academy e conhecer a academia.";
    const url = buildWhatsAppUrl(GYM_CONFIG.whatsappNumber, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GYM_CONFIG.address)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section id="contato" className="py-20 bg-brand-surface border-t border-brand-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-xs font-bold tracking-wider uppercase mb-3">
            Onde Estamos & Contato
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-display mb-4">
            Venha Conhecer a <span className="text-brand-gold">Nossa Casa</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Fácil acesso, vagas de estacionamento gratuitas e recepção pronta para receber você.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 bg-brand-dark border border-brand-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-card">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-gold" />
                <span>Informações de Contato</span>
              </h3>

              <div className="space-y-6 mb-8">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-gold mt-0.5 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Localização</h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {GYM_CONFIG.address}
                    </p>
                    <button
                      onClick={handleOpenMaps}
                      className="mt-2 text-xs font-bold text-brand-gold hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Como chegar (Traçar rota no GPS)
                    </button>
                  </div>
                </div>

                {/* WhatsApp / Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-gold mt-0.5 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Telefone / Recepção</h4>
                    <p className="text-xs sm:text-sm text-zinc-300">
                      {GYM_CONFIG.phoneFormatted}
                    </p>
                    <p className="text-[11px] text-zinc-500">Atendimento em horário de treino</p>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-brand-surface border border-brand-border text-brand-gold mt-0.5 flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Instagram Oficial</h4>
                    <a
                      href={GYM_CONFIG.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-zinc-300 hover:text-brand-gold flex items-center gap-1 transition-colors"
                    >
                      @helmansacademy
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-6 border-t border-brand-border">
              <button
                onClick={handleWhatsAppContact}
                className="w-full min-h-[48px] px-6 py-3 rounded-xl font-bold text-white bg-brand-whatsapp hover:bg-brand-whatsappHover transition-all flex items-center justify-center gap-2.5 shadow-md"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Conversar no WhatsApp Agora</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Column */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-brand-border shadow-card min-h-[350px] relative bg-brand-dark">
            <iframe
              title="Mapa de Localização da Helmans Academy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975870233076!2d-46.65657118447596!3d-23.56491716744837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              className="w-full h-full min-h-[380px] border-0 filter grayscale invert contrast-125 opacity-80 hover:opacity-100 transition-opacity"
              loading="lazy"
              allowFullScreen={false}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
