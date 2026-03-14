interface Props {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: Props) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
      {!isUser && (
        <div className="w-7 h-7 flex-shrink-0 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
          S
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-primary text-white rounded-tr-sm'
            : 'bg-card border border-muted/10 text-text rounded-tl-sm'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
