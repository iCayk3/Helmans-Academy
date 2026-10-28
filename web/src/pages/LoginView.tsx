import React, { useState } from 'react';
import { Lock, Mail, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import type { User } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: User, token: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@helmansacademy.com');
  const [password, setPassword] = useState('HelmansAdmin2026!');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await api.post<{ token: string; user: User }>('/auth/login', {
        email: email.trim(),
        password,
      });

      api.setToken(response.token);
      api.setUser(response.user);
      onLoginSuccess(response.user, response.token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-brand-black overflow-hidden selection:bg-brand-gold selection:text-brand-black">
      {/* Background Hero Image with atmospheric overlays */}
      <img
        src="/gym_hero_dark.webp"
        alt="Helmans Gym Background"
        className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105 filter blur-[1px]"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/85 to-brand-black/70" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-gold/5 rounded-full blur-[140px]" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-brand-surface/95 border border-brand-border rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl animate-in fade-in duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-block relative">
            <img
              src="/logo_helmans_master.webp"
              alt="Helmans Academy Logo"
              className="w-24 h-24 mx-auto object-contain drop-shadow-[0_4px_16px_rgba(255,199,0,0.35)]"
              loading="eager"
            />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
              Helmans <span className="text-brand-gold">Academy</span>
            </h1>
            <p className="text-xs text-brand-muted tracking-wider uppercase font-semibold mt-1">
              SaaS de Gestão Esportiva & Performance
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operador@helmansacademy.com"
                className="w-full pl-10 pr-4 py-3 bg-brand-black/80 border border-brand-border rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Senha de Segurança
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-brand-black/80 border border-brand-border rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-extrabold text-sm tracking-wide transition-all shadow-gold-sm hover:shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            style={{ minHeight: '44px' }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>Acessar Painel de Controle</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Credential Help */}
        <div className="mt-6 pt-5 border-t border-brand-border/60 text-center space-y-2">
          <span className="text-[11px] text-brand-muted uppercase font-semibold">
            Credenciais do Administrador (Padrão):
          </span>
          <div className="p-2.5 rounded-xl bg-brand-black/60 border border-brand-border/60 text-xs font-mono text-gray-300 flex justify-between items-center px-4">
            <span className="text-brand-gold font-semibold">admin@helmansacademy.com</span>
            <span className="text-gray-400">HelmansAdmin2026!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
