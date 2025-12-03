import { cn } from '@/lib/utils';

type Tone = 'indigo' | 'emerald' | 'amber' | 'cyan';

export const StatCard = ({
  label,
  value,
  tone = 'indigo',
  className,
}: {
  label: string;
  value: number | string;
  tone?: Tone;
  className?: string;
}) => {
  const toneClasses: Record<Tone, string> = {
    indigo: 'from-indigo-500/20 via-indigo-400/10 to-cyan-400/20',
    emerald: 'from-emerald-500/20 via-emerald-400/10 to-cyan-300/20',
    amber: 'from-amber-500/25 via-amber-300/10 to-orange-300/10',
    cyan: 'from-cyan-500/20 via-cyan-400/10 to-sky-300/20',
  };

  return (
    <div
      className={cn(
        'glass-panel rounded-2xl border border-white/10 p-4 shadow-lg shadow-indigo-500/10',
        className
      )}
    >
      <div className={`rounded-xl bg-gradient-to-br ${toneClasses[tone]} p-3 mb-3`} />
      <p className="text-sm text-slate-300">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};
