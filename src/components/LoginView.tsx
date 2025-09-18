import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

type LoginViewProps = {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onError: () => void;
};

export const LoginView = ({ onSuccess, onError }: LoginViewProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-aurora bg-fixed bg-cover">
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/25 bg-white/25 p-[1px] shadow-glass backdrop-blur-xl">
        <div className="space-y-8 rounded-[calc(theme(borderRadius.3xl)-1px)] bg-slate-950/40 px-10 py-12 text-white">
          <header className="space-y-4 text-center">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-white/70">
              ORA fluid chat
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-white">
              Googleでサインイン
            </h1>
            <p className="text-sm text-white/70">
              サインインすると、流体ガラス調のチャットルームに移動できます。
            </p>
          </header>
          <div className="flex flex-col items-center gap-6">
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              useOneTap
              theme="outline"
              shape="pill"
            />
            <div className="text-xs leading-relaxed text-white/60">
              <p>このデモではGoogleの資格情報をブラウザ内でのみ利用します。</p>
              <p>実運用ではバックエンドで検証を行うようにしてください。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
