import React from 'react';
import { X, Smartphone, Sparkles, MessageSquare } from 'lucide-react';
import { GYM_CONFIG } from '../data/gymData';
import { buildWhatsAppUrl } from '../utils/formatters';

interface StudentAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentAreaModal: React.FC<StudentAreaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSupportWhatsApp = () => {
    const msg = "Olá recepção da Helmans Academy! Sou aluno e preciso de suporte com minha ficha de treino ou mensalidade.";
    const url = buildWhatsAppUrl(GYM_CONFIG.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-brand-card transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4">
          <Smartphone className="w-6 h-6" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20 inline-block mb-3">
          Ecossistema Digital Helmans
        </span>

        <h3 className="text-2xl font-black text-white font-display mb-3">
          Área do Aluno (SaaS)
        </h3>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
          Nosso novo sistema de gestão e aplicativo exclusivo do aluno está em fase final de implantação! Em breve você poderá acompanhar seus treinos, evolução de cargas e controle financeiro direto por aqui.
        </p>

        <div className="p-4 rounded-xl bg-brand-dark border border-brand-border space-y-2 mb-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <Sparkles className="w-4 h-4 text-brand-gold flex-shrink-0" />
            <span>Ficha de Treino Digital com Vídeos</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <Sparkles className="w-4 h-4 text-brand-gold flex-shrink-0" />
            <span>Histórico de Bioimpedância e Medidas</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <Sparkles className="w-4 h-4 text-brand-gold flex-shrink-0" />
            <span>Liberação de Catraca por QR Code</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSupportWhatsApp}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl font-bold text-black bg-brand-gold hover:bg-brand-goldDark shadow-gold transition-all flex items-center justify-center gap-2 text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Solicitar Suporte na Recepção</span>
          </button>

          <button
            onClick={onClose}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-zinc-400 hover:text-white bg-transparent transition-colors text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
