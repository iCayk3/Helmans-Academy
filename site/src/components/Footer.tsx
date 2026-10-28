import React from 'react';
import { Dumbbell, ShieldCheck, User, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenTrialModal: () => void;
  onOpenStudentModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTrialModal, onOpenStudentModal }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark border-t border-brand-border text-zinc-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-brand-gold/40">
                <img
                  src="/images/logo.webp"
                  alt="Helmans Academy"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="font-extrabold text-lg tracking-wider text-white uppercase font-display">
                Helmans <span className="text-brand-gold">Academy</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              O ecossistema definitivo para o praticante de musculação sério. Força bruta, ergonomia avançada e suporte humanizado para sua melhor performance.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
              <span>Ambiente 100% monitorado e seguro</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenTrialModal}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 text-left text-brand-gold font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Agendar Aula Grátis</span>
                </button>
              </li>
              <li>
                <a href="#sobre" className="hover:text-brand-gold transition-colors">
                  Sobre Nós & Filosofia
                </a>
              </li>
              <li>
                <a href="#estrutura" className="hover:text-brand-gold transition-colors">
                  Estrutura & Equipamentos
                </a>
              </li>
              <li>
                <a href="#modalidades" className="hover:text-brand-gold transition-colors">
                  Modalidades de Treino
                </a>
              </li>
              <li>
                <a href="#calculadora" className="hover:text-brand-gold transition-colors">
                  Calculadora IMC & TDEE
                </a>
              </li>
              <li>
                <a href="#planos" className="hover:text-brand-gold transition-colors">
                  Tabela de Planos
                </a>
              </li>
              <li>
                <a href="#horarios" className="hover:text-brand-gold transition-colors">
                  Horários de Abertura
                </a>
              </li>
            </ul>
          </div>

          {/* Integrations & Student Portal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              Portal do Aluno
            </h4>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Alunos matriculados têm acesso digital exclusivo a treinos, evolução física e financeiro através do nosso sistema.
            </p>
            <button
              onClick={onOpenStudentModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-surface hover:bg-brand-card border border-brand-border text-xs font-semibold text-zinc-200 hover:text-brand-gold transition-all"
            >
              <User className="w-4 h-4 text-brand-gold" />
              <span>Acessar Área do Aluno</span>
            </button>
          </div>

          {/* Legal & LGPD */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-display">
              Segurança & Privacidade
            </h4>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Tratamos seus dados com total responsabilidade em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
            <div className="p-3 rounded-lg bg-brand-surface/60 border border-brand-border text-[11px] text-zinc-500">
              Dados coletados em formulários são destinados exclusivamente ao agendamento de aulas e contato comercial da Helmans Academy.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {currentYear} Helmans Academy. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito para quem treina pesado <Dumbbell className="w-3.5 h-3.5 text-brand-gold" />
          </p>
        </div>
      </div>
    </footer>
  );
};
