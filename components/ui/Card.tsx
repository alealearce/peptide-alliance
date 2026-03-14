import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-card rounded-2xl shadow-sm border border-muted/10 overflow-hidden', className)}>
      {children}
    </div>
  );
}
