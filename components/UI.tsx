import React from 'react';
import { LucideIcon } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' | 'danger' }> = ({
  className = '',
  variant = 'primary',
  ...props
}) => {
  const base = "px-4 py-3 rounded font-bold transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary text-black hover:bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]",
    outline: "border border-primary text-primary hover:bg-primary/10",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; icon?: LucideIcon }> = ({ children, className = '', title, icon: Icon }) => (
  <div className={`bg-surface border border-slate-800 p-5 rounded-lg ${className}`}>
    {title && (
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-200">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

export const ProgressBar: React.FC<{ value: number; max: number; color?: string }> = ({ value, max, color = 'bg-primary' }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export const StatBox: React.FC<{ label: string; value: string | number; sub?: string }> = ({ label, value, sub }) => (
  <div className="bg-surfaceHighlight p-3 rounded border border-slate-700/50 text-center">
    <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-xl font-mono font-bold text-white">{value}</div>
    {sub && <div className="text-[10px] text-slate-500">{sub}</div>}
  </div>
);
