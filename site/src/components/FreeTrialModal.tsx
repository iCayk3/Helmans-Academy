import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Dumbbell } from 'lucide-react';
import { GYM_CONFIG } from '../data/gymData';
import { maskPhone, isValidBrazilianPhone, sanitizeText, buildWhatsAppUrl } from '../utils/formatters';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeTrialModal: React.FC<FreeTrialModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [shift, setShift] = useState<'manha' | 'tarde' | 'noite'>('manha');
  const [objective, setObjective] = useState('hipertrofia');
  // Honeypot field for anti-spam (should remain empty for real humans)
  const [honeypot, setHoneypot] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(maskPhone(e.target.value));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-spam check (honeypot)
    if (honeypot.trim() !== '') {
      console.warn('Bot detected by honeypot');
      onClose();
      return;
    }

    // 2. Sanitization
    const sanitizedName = sanitizeText(name);

    // 3. Validation
    if (sanitizedName.length < 3) {
      setError('Por favor, informe seu nome completo (mínimo de 3 caracteres).');
      return;
    }

    if (!isValidBrazilianPhone(phone)) {
      setError('Por favor, digite um número de WhatsApp válido com DDD (Ex: 11 99999-9999).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Shift map
    const shiftLabels: Record<string, string> = {
      manha: 'Manhã (05h às 12h)',
      tarde: 'Tarde (12h às 18h)',
      noite: 'Noite (18h às 23h)',
    };

    const objectiveLabels: Record<string, string> = {
      hipertrofia: 'Hipertrofia / Ganho de Massa',
      emagrecimento: 'Emagrecimento / Definição',
      condicionamento: 'Saúde & Condicionamento Geral',
      forca: 'Força & Biomecânica',
    };

    try {
      // If VITE_LEADS_API_URL is configured, dispatch webhook asynchronously
      const leadsApi = import.meta.env.VITE_LEADS_API_URL;
      if (leadsApi) {
        await fetch(leadsApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: sanitizedName,
            phone,
            shift: shiftLabels[shift],
            objective: objectiveLabels[objective],
            createdAt: new Date().toISOString(),
          }),
        }).catch((err) => console.warn('Could not post lead to external webhook:', err));
      }

      setIsSuccess(true);

      // Construct structured WhatsApp message
      const textMessage = `*NOVO AGENDAMENTO DE AULA EXPERIMENTAL*\n\n` +
        `👤 *Nome:* ${sanitizedName}\n` +
        `📱 *WhatsApp:* ${phone}\n` +
        `⏰ *Turno Preferido:* ${shiftLabels[shift]}\n` +
        `🎯 *Objetivo:* ${objectiveLabels[objective]}\n\n` +
        `Olá recepção da Helmans Academy! Gostaria de confirmar meu agendamento de aula grátis.`;

      const whatsappUrl = buildWhatsAppUrl(GYM_CONFIG.whatsappNumber, textMessage);

      // Redirect after brief visual feedback
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        setIsSubmitting(false);
        onClose();
        setIsSuccess(false);
        setName('');
        setPhone('');
      }, 1200);
    } catch {
      setError('Ocorreu um erro ao processar. Tente novamente ou nos contate diretamente pelo WhatsApp.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg bg-brand-surface border border-brand-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-brand-card transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            100% Gratuito • Sem Compromisso
          </span>
        </div>

        <h3 id="modal-title" className="text-2xl sm:text-3xl font-black text-white font-display mb-2">
          Agende sua Aula Experimental
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
          Preencha abaixo para liberarmos sua catraca com treino guiado por um instrutor credenciado.
        </p>

        {/* Success State */}
        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Quase pronto!</h4>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mb-4">
              Estamos redirecionando você para o WhatsApp da recepção para confirmar seu horário...
            </p>
            <Loader2 className="w-5 h-5 text-brand-gold animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field (hidden from users, anti-spam) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_url_check"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ex: Carlos Eduardo Silva"
                className="w-full min-h-[46px] bg-brand-dark border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
              />
            </div>

            {/* WhatsApp Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                WhatsApp com DDD *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                maxLength={15}
                className="w-full min-h-[46px] bg-brand-dark border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
              />
            </div>

            {/* Shift & Objective Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Melhor Turno
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  className="w-full min-h-[46px] bg-brand-dark border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors cursor-pointer"
                >
                  <option value="manha">Manhã (05h às 12h)</option>
                  <option value="tarde">Tarde (12h às 18h)</option>
                  <option value="noite">Noite (18h às 23h)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Foco do Treino
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full min-h-[46px] bg-brand-dark border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors cursor-pointer"
                >
                  <option value="hipertrofia">Hipertrofia</option>
                  <option value="emagrecimento">Emagrecimento</option>
                  <option value="condicionamento">Condicionamento</option>
                  <option value="forca">Força Bruta</option>
                </select>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[50px] mt-2 py-3.5 px-6 rounded-xl font-bold text-black bg-brand-gold hover:bg-brand-goldDark shadow-gold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processando agendamento...</span>
                </>
              ) : (
                <>
                  <Dumbbell className="w-5 h-5" />
                  <span>Confirmar Agendamento no WhatsApp</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Privacy notice */}
            <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              Garantimos sua privacidade. Não enviamos spam.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
