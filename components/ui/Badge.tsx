import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'verified' | 'verified_source' | 'category' | 'muted' | 'featured' | 'industry_leader';
  className?: string;
}

export function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shrink-0',
        {
          'bg-primary/10 text-primary': variant === 'verified',
          'bg-emerald-50 text-emerald-700 border border-emerald-300': variant === 'verified_source',
          'bg-accent/10 text-primary': variant === 'category',
          'bg-muted/10 text-muted': variant === 'muted',
          'bg-amber-100 text-amber-700 border border-amber-300': variant === 'featured',
          'bg-amber-50 text-amber-800 border border-amber-400 ring-1 ring-amber-200': variant === 'industry_leader',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
