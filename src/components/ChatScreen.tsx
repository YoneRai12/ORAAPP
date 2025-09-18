import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Attachment, Message, UserProfile } from '../types';
import { MessageBubble } from './MessageBubble';
import { Switch } from './Switch';

export type SendPayload = {
  text: string;
  attachments: Attachment[];
  webSearchEnabled: boolean;
};

type ChatScreenProps = {
  user: UserProfile;
  messages: Message[];
  onSend: (payload: SendPayload) => void;
  onSignOut: () => void;
};

export const ChatScreen = ({ user, messages, onSend, onSignOut }: ChatScreenProps) => {
  const [text, setText] = useState('');
  const [webSearch, setWebSearch] = useState(true);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const isSendDisabled = useMemo(() => {
    return text.trim().length === 0 && attachments.length === 0;
  }, [text, attachments]);

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
      reader.readAsDataURL(file);
    });

  const handleFileSelection = async (input: HTMLInputElement | null, type: Attachment['type']) => {
    const files = input?.files;
    if (!files?.length) return;
    const newAttachments = await Promise.all(
      Array.from(files).map(async (file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        type,
        url: await toDataUrl(file)
      }))
    );
    setAttachments((prev) => [...prev, ...newAttachments]);
    if (input) {
      input.value = '';
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSendDisabled) return;
    onSend({
      text: text.trim(),
      attachments,
      webSearchEnabled: webSearch
    });
    setText('');
    setAttachments([]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.35),_rgba(15,23,42,0.95))] text-white">
      <header className="z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-slate-950/30 px-8 py-6 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          {user.picture ? (
            <img src={user.picture} alt={user.name} className="h-12 w-12 rounded-2xl border border-white/20 object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-lg font-semibold">
              {user.name.slice(0, 1)}
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">オンライン</p>
            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
            <p className="text-xs text-white/60">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            Fluid Glass Mode
          </div>
          <button
            onClick={onSignOut}
            className="rounded-full border border-white/20 bg-white/20 px-5 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/30"
          >
            サインアウト
          </button>
        </div>
      </header>
      <main className="relative flex flex-1 flex-col overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_60%),radial-gradient(circle_at_80%_0%,rgba(244,114,182,0.25),transparent_55%),radial-gradient(circle_at_0%_80%,rgba(129,140,248,0.2),transparent_60%)]" />
        <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto px-6 py-10">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-white/15 bg-white/10 p-10 text-center text-white/70 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white">ようこそ 👋</h3>
              <p className="mt-2 text-sm leading-relaxed">
                Web検索のON/OFF、画像やファイルの添付を組み合わせて、
                あなたのアシスタントにリクエストを送ってみましょう。
              </p>
            </div>
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} />)
          )}
        </div>
        <div className="border-t border-white/10 bg-slate-950/30 px-6 py-6 backdrop-blur-xl">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-4xl flex-col gap-4 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg backdrop-blur-2xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.35em] text-white/70">Web検索</span>
                <Switch active={webSearch} onClick={() => setWebSearch((prev) => !prev)} label="web-search" />
              </div>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium text-white transition hover:border-cyan-200/60 hover:bg-white/20"
                >
                  🖼️ 画像を追加
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium text-white transition hover:border-cyan-200/60 hover:bg-white/20"
                >
                  📎 ファイルを追加
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={() => void handleFileSelection(imageInputRef.current, 'image')}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={() => void handleFileSelection(fileInputRef.current, 'file')}
                  className="hidden"
                />
              </div>
            </div>
            {attachments.length ? (
              <div className="flex flex-wrap gap-3">
                {attachments.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-xs text-white/80 backdrop-blur-xl"
                  >
                    <span className="text-lg">{item.type === 'image' ? '🖼️' : '📄'}</span>
                    <span className="max-w-[160px] truncate font-medium text-white/90">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(item.id)}
                      className="ml-auto rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-white/80 transition group-hover:border-rose-200/60 group-hover:bg-rose-500/30"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="メッセージを入力 (Shift + Enterで改行)"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  if (!isSendDisabled) {
                    (event.currentTarget.form as HTMLFormElement)?.dispatchEvent(
                      new Event('submit', { cancelable: true, bubbles: true })
                    );
                  }
                }
              }}
              rows={3}
              className="w-full resize-none rounded-2xl border border-white/20 bg-slate-950/40 px-5 py-4 text-sm text-white placeholder:text-white/40 focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
            />
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                Fluid Intelligence • リアルタイム同期準備OK
              </p>
              <button
                type="submit"
                disabled={isSendDisabled}
                className="flex items-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-cyan-400/90 via-sky-500/90 to-purple-500/90 px-6 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 shadow-lg transition hover:from-cyan-300 hover:via-sky-400 hover:to-purple-400 disabled:cursor-not-allowed disabled:border-white/20 disabled:bg-white/15 disabled:text-white/40"
              >
                送信
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
