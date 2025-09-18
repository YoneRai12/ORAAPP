import { useCallback, useEffect, useMemo, useState } from 'react';
import { CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { ChatScreen, SendPayload } from './components/ChatScreen';
import { LoginView } from './components/LoginView';
import { Message, UserProfile } from './types';

type GoogleJwtPayload = {
  email?: string;
  name?: string;
  picture?: string;
  given_name?: string;
};

const STORAGE_USER_KEY = 'oraapp:user';
const STORAGE_MESSAGES_KEY = 'oraapp:messages';

const loadFromStorage = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`${key} の読み込みに失敗しました`, error);
    return null;
  }
};

const persistToStorage = <T,>(key: string, value: T | null) => {
  if (typeof window === 'undefined') return;
  if (value === null) {
    window.localStorage.removeItem(key);
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

const buildAssistantReply = (payload: SendPayload): string => {
  const prompts: string[] = [];
  if (payload.webSearchEnabled) {
    prompts.push('Web検索の結果も交えて調査します。');
  } else {
    prompts.push('ローカル知識のみで回答します。');
  }
  if (payload.attachments.length) {
    const files = payload.attachments
      .map((item) => `${item.name}${item.type === 'image' ? '（画像）' : ''}`)
      .join(' / ');
    prompts.push(`添付された ${files} を参照します。`);
  }
  prompts.push('しばらくお待ちください…');
  return prompts.join('\n');
};

const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function App() {
  const [user, setUser] = useState<UserProfile | null>(() => loadFromStorage<UserProfile>(STORAGE_USER_KEY));
  const [messages, setMessages] = useState<Message[]>(() => loadFromStorage<Message[]>(STORAGE_MESSAGES_KEY) ?? []);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  useEffect(() => {
    persistToStorage(STORAGE_USER_KEY, user);
  }, [user]);

  useEffect(() => {
    persistToStorage(STORAGE_MESSAGES_KEY, messages);
  }, [messages]);

  const handleLogin = useCallback((credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('Google認証情報が取得できませんでした。');
      }
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
      const profile: UserProfile = {
        name: decoded.name ?? decoded.given_name ?? 'ゲスト',
        email: decoded.email ?? 'unknown@example.com',
        picture: decoded.picture
      };
      setUser(profile);
    } catch (error) {
      console.error('ログイン処理に失敗しました', error);
    }
  }, []);

  const handleLoginError = useCallback(() => {
    console.error('Googleログインに失敗しました');
  }, []);

  const handleSend = useCallback(
    (payload: SendPayload) => {
      if (!user) return;
      const userMessage: Message = {
        id: generateId(),
        text: payload.text,
        createdAt: new Date().toISOString(),
        from: 'user',
        attachments: payload.attachments,
        webSearchEnabled: payload.webSearchEnabled
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsAssistantTyping(true);
      setTimeout(() => {
        const reply: Message = {
          id: generateId(),
          text:
            payload.text.trim().length > 0
              ? `「${payload.text.slice(0, 120)}」について理解しました。\n${buildAssistantReply(payload)}`
              : buildAssistantReply(payload),
          createdAt: new Date().toISOString(),
          from: 'assistant'
        };
        setMessages((prev) => [...prev, reply]);
        setIsAssistantTyping(false);
      }, 650);
    },
    [user]
  );

  const handleSignOut = useCallback(() => {
    setUser(null);
    setMessages([]);
    setIsAssistantTyping(false);
    persistToStorage(STORAGE_USER_KEY, null);
    persistToStorage(STORAGE_MESSAGES_KEY, null);
  }, []);

  const enhancedMessages = useMemo(() => {
    if (!isAssistantTyping) return messages;
    return [
      ...messages,
      {
        id: 'typing-indicator',
        text: 'アシスタントが回答を準備しています…',
        createdAt: new Date().toISOString(),
        from: 'assistant' as const
      }
    ];
  }, [isAssistantTyping, messages]);

  if (!user) {
    return <LoginView onSuccess={handleLogin} onError={handleLoginError} />;
  }

  return <ChatScreen user={user} messages={enhancedMessages} onSend={handleSend} onSignOut={handleSignOut} />;
}

export default App;
