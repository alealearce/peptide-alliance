import { ShieldCheck, FlaskConical, Building2 } from 'lucide-react';
import { COPY } from '@/lib/config/site';

const icons = [ShieldCheck, FlaskConical, Building2];

export function WhyPeptideAlliance() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text text-center mb-10">
        {COPY.why.heading}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {COPY.why.reasons.map((reason, i) => {
          const Icon = icons[i];
          return (
            <div
              key={reason.title}
              className="rounded-2xl border border-muted/10 bg-white p-8 flex flex-col items-center text-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-text text-base leading-snug">
                {reason.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {reason.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
