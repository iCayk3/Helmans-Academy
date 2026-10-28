import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { GYM_CONFIG } from '../data/gymData';
import { buildWhatsAppUrl } from '../utils/formatters';

export const WhatsAppFloating: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = () => {
    const message = "Olá! Estava no site da Helmans Academy e gostaria de tirar dúvidas sobre os treinos e planos.";
    const url = buildWhatsAppUrl(GYM_CONFIG.whatsappNumber, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="relative bg-brand-surface border border-brand-border text-zinc-100 px-4 py-2.5 rounded-2xl shadow-card text-xs max-w-[220px] animate-fadeIn hidden sm:flex items-center justify-between gap-2">
          <span>Tire suas dúvidas ou agende sua visita no WhatsApp!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-zinc-400 hover:text-white p-1"
            aria-label="Fechar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Button */}
      <button
        type="button"
        onClick={handleClick}
        className="w-14 h-14 rounded-full bg-brand-whatsapp hover:bg-brand-whatsappHover text-white shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400/30 group"
        aria-label="Abrir conversa no WhatsApp"
      >
        <span className="absolute w-full h-full rounded-full bg-brand-whatsapp opacity-75 animate-ping -z-10 group-hover:hidden" />
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
};
