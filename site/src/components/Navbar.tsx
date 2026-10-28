import React, { useState, useEffect } from 'react';
import { Menu, X, Dumbbell, User, Sparkles } from 'lucide-react';
import { GYM_CONFIG } from '../data/gymData';

interface NavbarProps {
  onOpenTrialModal: () => void;
  onOpenStudentModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTrialModal, onOpenStudentModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Estrutura', href: '#estrutura' },
    { label: 'Modalidades', href: '#modalidades' },
    { label: 'Calculadora', href: '#calculadora' },
    { label: 'Planos', href: '#planos' },
    { label: 'Horários', href: '#horarios' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleStudentAreaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (GYM_CONFIG.saasUrl) {
      window.open(GYM_CONFIG.saasUrl, '_blank', 'noopener,noreferrer');
    } else {
      onOpenStudentModal();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-dark/95 backdrop-blur-md border-b border-brand-border py-2.5 shadow-xl'
          : 'bg-brand-dark/80 backdrop-blur-sm py-3.5 border-b border-brand-border/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-12">
          {/* Logo & Brand Name (Left) */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-gold rounded-lg p-0.5 flex-shrink-0"
            aria-label="Helmans Academy - Início"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-brand-gold/40 shadow-gold-sm transition-transform group-hover:scale-105 flex-shrink-0">
              <img
                src="./images/logo.webp"
                alt="Logo Helmans Academy"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-white uppercase font-display leading-tight flex items-center gap-1">
                Helmans <span className="text-brand-gold">Academy</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                Musculação & Performance
              </span>
            </div>
          </a>

          {/* Desktop Nav Links (Center Capsule) */}
          <nav
            className="hidden lg:flex items-center gap-0.5 xl:gap-1 px-3 py-1.5 rounded-full bg-brand-surface/80 border border-brand-border/80 shadow-inner backdrop-blur-md"
            aria-label="Navegação principal"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs xl:text-[13px] font-medium text-zinc-300 hover:text-brand-gold hover:bg-white/5 px-2.5 xl:px-3 py-1 rounded-full transition-all whitespace-nowrap focus:outline-none focus:text-brand-gold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs (Right) */}
          <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
            {/* Link Área do Aluno (Integração SaaS) */}
            <button
              onClick={handleStudentAreaClick}
              className="h-9 px-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-brand-surface hover:bg-brand-card border border-brand-border hover:border-zinc-500 rounded-lg transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand-gold"
              title="Acessar Área do Aluno"
            >
              <User className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
              <span>Área do Aluno</span>
            </button>

            {/* CTA Principal - Aula Experimental */}
            <button
              onClick={onOpenTrialModal}
              className="h-9 px-4 inline-flex items-center gap-1.5 text-xs font-bold text-black bg-brand-gold hover:bg-brand-goldDark rounded-lg shadow-gold transition-all transform hover:-translate-y-0.5 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold"
            >
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Aula Experimental Grátis</span>
            </button>
          </div>

          {/* Mobile Menu & Quick CTA */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenTrialModal}
              className="h-8 px-2.5 text-xs font-bold text-black bg-brand-gold rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1"
              aria-label="Agendar Aula"
            >
              <Sparkles className="w-3 h-3" />
              <span>Aula Grátis</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 min-h-[40px] min-w-[40px] rounded-lg text-zinc-300 hover:text-white hover:bg-brand-card focus:outline-none focus:ring-2 focus:ring-brand-gold flex items-center justify-center border border-brand-border"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-dark/98 border-b border-brand-border px-4 pt-3 pb-6 space-y-3 animate-fadeIn backdrop-blur-xl">
          <div className="flex flex-col space-y-1 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-200 hover:bg-brand-surface hover:text-brand-gold transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <Dumbbell className="w-4 h-4 text-zinc-600" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-brand-border flex flex-col gap-2.5">
            <button
              onClick={handleStudentAreaClick}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-200 bg-brand-surface border border-brand-border rounded-lg"
            >
              <User className="w-4 h-4 text-brand-gold" />
              <span>Área do Aluno (SaaS)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrialModal();
              }}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-black bg-brand-gold hover:bg-brand-goldDark rounded-lg shadow-gold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Agendar Aula Grátis</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
