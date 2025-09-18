import { Message } from '../types';

export const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.from === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xl rounded-3xl border border-white/20 bg-white/15 px-5 py-4 text-sm shadow-lg backdrop-blur-xl transition-colors duration-300 ${
          isUser ? 'rounded-tr-md bg-cyan-500/30 text-white' : 'rounded-tl-md text-white'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs uppercase tracking-widest text-white/60">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-[10px] text-white/50">
            {new Date(message.createdAt).toLocaleTimeString('ja-JP', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <p className="mt-3 whitespace-pre-wrap leading-relaxed text-white/90">{message.text}</p>
        {message.attachments?.length ? (
          <div className="mt-3 space-y-2">
            {message.attachments.map((file) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 text-xs text-white/80 transition hover:border-cyan-200/60 hover:bg-white/20"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
                    {file.type === 'image' ? '🖼️' : '📄'}
                  </span>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white/90">{file.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/60">{file.type}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : null}
        {message.webSearchEnabled ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-cyan-50">
            🔍 Web検索利用
          </div>
        ) : null}
      </div>
    </div>
  );
};
