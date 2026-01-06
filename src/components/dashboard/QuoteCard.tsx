import { Quote } from 'lucide-react';

interface QuoteCardProps {
  quote: string;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border animate-slide-up" style={{ animationDelay: '0.05s' }}>
      <div className="flex items-start gap-3">
        <Quote className="w-6 h-6 text-accent shrink-0" />
        <p className="text-lg font-medium text-foreground italic leading-relaxed">
          "{quote}"
        </p>
      </div>
    </div>
  );
}
