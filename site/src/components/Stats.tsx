import React from 'react';
import { GYM_STATS } from '../data/gymData';
import { TrendingUp, Users, MapPin, Star } from 'lucide-react';

export const Stats: React.FC = () => {
  const icons = [Users, MapPin, TrendingUp, Star];

  return (
    <section className="relative z-20 -mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card backdrop-blur-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
          {GYM_STATS.map((stat, idx) => {
            const IconComponent = icons[idx] || TrendingUp;
            return (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center ${
                  idx > 0 && idx % 2 === 0 ? 'pt-6 lg:pt-0' : idx % 2 !== 0 && idx > 1 ? 'pt-6 lg:pt-0' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-3">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-glow-gold">
                  {stat.value}
                </span>
                <span className="text-sm font-bold text-zinc-200 mt-1">{stat.label}</span>
                <span className="text-xs text-zinc-400 mt-0.5">{stat.sub}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
