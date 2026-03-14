'use client';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Send } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const t = useTranslations('chatbot');
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const val = ref.current?.value.trim();
    if (!val || disabled) return;
    onSend(val);
    if (ref.current) ref.current.value = '';
  };

  return (
    <div className="flex items-end gap-2 border-t border-muted/10 p-3">
      <textarea
        ref={ref}
        rows={1}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={t('placeholder')}
        className="flex-1 resize-none rounded-xl border border-muted/20 bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-28 overflow-y-auto"
      />
      <button
        onClick={submit}
        disabled={disabled}
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
